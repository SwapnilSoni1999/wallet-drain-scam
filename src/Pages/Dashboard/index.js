import React from "react";
import {
  Box,
  Typography,
  Stack,
  Skeleton,
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
  Pagination,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useSelector } from "react-redux";
import Web3 from "web3";
import {
  RPC,
  vrtABI,
  vrtAddress,
  daoABI,
  daoAddress,
} from "../../Constants/config";

const web3 = new Web3(new Web3.providers.HttpProvider(RPC));
const vrtContract = new web3.eth.Contract(vrtABI, vrtAddress);
const daoContract = new web3.eth.Contract(daoABI, daoAddress);
const pageStep = 20;

const cards = [
  {
    img: "/images/total_supply.png",
    color: "#FFF2EC",
    img_dark: "/images/total_supply_dark.png",
    title: "Total Supply",
    price: "45,230,256",
  },
  {
    img: "/images/holder.png",
    color: "#ECFBFF",
    img_dark: "/images/holder_dark.png",
    title: "Holder Number",
    price: 230,
  },
  {
    img: "/images/owner.png",
    color: "#EDFFEF",
    img_dark: "/images/owner_dark.png",
    title: "Dao Owner",
    price: "0x176B6eB693792Ad7081E2 5B537D8E14bea130Ff8",
  },
];

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      totalSupply: 0,
      holders: [],
      holderTable: [],
      realHolderTable: [],
      owner: "",
      admin: "",
      loading: true,
      page: 1,
    };
  }

  async init(nextProps) {
    if (nextProps.account) {
      const owner = await daoContract.methods.owner().call();
      const totalSupply = await vrtContract.methods.totalSupply().call();
      const holders = await vrtContract.methods.getHolders().call();
      const admin = await daoContract.methods.admin().call();

      this.setState({
        owner: owner,
        totalSupply: totalSupply / 1,
        holders: holders,
        realHolderTable: [],
        holderTable: [],
        admin: admin,
        loading: true,
      });

      const holderContainer = [];

      for (let i = 0; i < holders.length; i++) {
        let balanceOfHolder = await vrtContract.methods
          .balanceOf(holders[i])
          .call();
        let tableRow = {
          id: i + 1,
          address: holders[i],
          balance: balanceOfHolder / 1,
          percentage: ((balanceOfHolder * 100) / totalSupply).toFixed(2),
        };
        holderContainer.push(tableRow);
      }

      this.setState({
        holderTable: holderContainer,
        realHolderTable: holderContainer.slice(
          (this.state.page - 1) * pageStep,
          this.state.page * pageStep
        ),
        loading: false,
      });
    }
  }

  handlePage(event, page) {
    this.setState({
      page: page,
      realHolderTable: this.state.holderTable.slice(
        (page - 1) * pageStep,
        page * pageStep
      ),
    });
  }

  async componentWillReceiveProps(nextProps) {
    await this.init(nextProps);
  }

  async componentDidMount() {
    await this.init(this.props);
  }
  render() {
    return (
      <Box sx={{ pb: 7 }}>
        <Box
          sx={{
            bgcolor:
              this.props.theme.palette.mode === "dark"
                ? "rgba(0,0,0,.8)"
                : "rgba(252,252,252,.3)",
          }}
        >
          <Box
            sx={{
              position: "relative",
              py: 4,
              px: this.props.matchUpMd ? 7 : 2,
              "&::after": {
                content: `""`,
                background: "url(/images/background.png)",
                // opacity: .1,
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: -1,
              },
            }}
          >
            <Typography variant="h3">Vegan Rob's Governance Token</Typography>
            <Stack
              flexDirection={this.props.matchUpMd ? "row" : "column"}
              gap={this.props.matchDownLg ? 6 : 9}
              justifyContent="center"
              sx={{
                pt: 4,
                px: 4,
              }}
            >
              {cards.map((element, key) => (
                <Box
                  key={key}
                  flex="1 1 0"
                  sx={{
                    borderRadius: 5,
                    p: 4,
                    pt: 2,
                    border:
                      this.props.theme.palette.mode === "dark"
                        ? "none"
                        : `0.5px solid #CBCBCB`,
                    bgcolor:
                      this.props.theme.palette.mode === "dark"
                        ? this.props.theme.palette.background.paper
                        : element.color,
                    boxShadow:
                      this.props.theme.palette.mode === "dark"
                        ? "none"
                        : "0px 0px 10px rgba(0, 0, 0, 0.07)",
                  }}
                >
                  <Stack
                    flexDirection="row"
                    alignItems="center"
                    gap={2}
                    sx={{ pb: 2 }}
                  >
                    <Stack
                      alignItems="center"
                      justifyContent="center"
                      sx={{ height: 40 }}
                    >
                      <Box
                        component="img"
                        src={
                          this.props.theme.palette.mode === "dark"
                            ? element.img_dark
                            : element.img
                        }
                      />
                    </Stack>
                    <Typography
                      sx={{
                        textTransform: "uppercase",
                        color: this.props.theme.palette.text.disabled,
                      }}
                    >
                      {element.title}
                    </Typography>
                  </Stack>
                  <Typography
                    variant={key === 2 ? "subtitle2" : "h1"}
                    sx={{ textAlign: "center", wordBreak: "break-all" }}
                  >
                    {key === 0
                      ? this.state.totalSupply
                      : key === 1
                      ? this.state.holders.length
                      : key === 2
                      ? this.state.owner
                      : 0}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Box>
        </Box>
        <Box
          sx={{
            pt: 4,
            px: this.props.matchUpMd ? 7 : 2,
            maxWidth: "100%",
          }}
        >
          <Typography variant="h3">Members of Vegan Rob's DAO</Typography>
          <Box
            sx={{
              pt: 3,
              px: this.props.matchUpMd ? 6 : 0,
            }}
          >
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow
                    sx={{
                      "& th": {
                        color: this.props.theme.palette.text.secondary,
                      },
                    }}
                  >
                    <TableCell align="left">No</TableCell>
                    <TableCell align="center">Holder Address</TableCell>
                    <TableCell align="center">Balance</TableCell>
                    <TableCell align="center">Percentage</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {!this.state.loading
                    ? this.state.realHolderTable.map((row, index) => (
                        <TableRow
                          key={index}
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                          }}
                        >
                          <TableCell align="left">{row.id}</TableCell>
                          <TableCell align="center">{row.address}</TableCell>
                          <TableCell align="center">{row.balance}</TableCell>
                          <TableCell
                            align="center"
                            sx={{
                              color: this.props.theme.palette.success.main,
                              // color: index % 2 ? this.props.theme.palette.error.main : this.props.theme.palette.success.main
                            }}
                          >
                            {row.percentage}%
                          </TableCell>
                        </TableRow>
                      ))
                    : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((row, key) => (
                        <TableRow
                          key={key}
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                          }}
                        >
                          <TableCell align="left">
                            <Skeleton />
                          </TableCell>
                          <TableCell align="center">
                            <Skeleton />
                          </TableCell>
                          <TableCell align="center">
                            <Skeleton />
                          </TableCell>
                          <TableCell
                            align="center"
                            sx={{
                              color: this.props.theme.palette.success.main,
                              // color: index % 2 ? this.props.theme.palette.error.main : this.props.theme.palette.success.main
                            }}
                          >
                            <Skeleton />
                          </TableCell>
                        </TableRow>
                      ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Stack
              flexDirection="row"
              alignItems="flex-end"
              justifyContent="flex-end"
              sx={{ pt: 2 }}
            >
              <Pagination
                count={Math.ceil(this.state.holders.length / pageStep)}
                variant="outlined"
                shape="rounded"
                onChange={(event, page) => this.handlePage(event, page)}
                page={this.state.page}
              />
            </Stack>
          </Box>
        </Box>
      </Box>
    );
  }
}

const withHook = (Component) => {
  return (props) => {
    const theme = useTheme();
    const matchDownLg = useMediaQuery(theme.breakpoints.down("lg"));
    const matchUpMd = useMediaQuery(theme.breakpoints.up("md"));
    // const matchDownMd = useMediaQuery(theme.breakpoints.up('md'));
    const { account } = useSelector((state) => state.userReducer);
    return (
      <Component
        theme={theme}
        account={account}
        matchDownLg={matchDownLg}
        matchUpMd={matchUpMd}
        {...props}
      />
    );
  };
};

export default withHook(Dashboard);
