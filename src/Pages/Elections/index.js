import React from "react";
import {
  Box,
  Chip,
  Typography,
  Stack,
  IconButton,
  OutlinedInput,
  useMediaQuery,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import ThumbDownOutlinedIcon from "@mui/icons-material/ThumbDownOutlined";
import ThumbUpAltOutlinedIcon from "@mui/icons-material/ThumbUpAltOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import SearchIcon from "@mui/icons-material/Search";
import ElectionIcon from "../../Components/icons/ElectionIcon";
import { useSelector } from "react-redux";
import Web3 from "web3";
import { RPC, daoABI, daoAddress } from "../../Constants/config";
import { unixStamp } from "../../Utils/date";

const web3 = new Web3(new Web3.providers.HttpProvider(RPC));
const daoContract = new web3.eth.Contract(daoABI, daoAddress);

// const ITEM_HEIGHT = 48;
// const ITEM_PADDING_TOP = 8;
// const MenuProps = {
//   PaperProps: {
//     style: {
//       maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
//       width: 250,
//     },
//   },
// };

const cards = [
  {
    img: "/images/dash_new.png",
    color: "#FFF2EC",
    img_dark: "/images/dash_new_dark.png",
    title: "Number OF Created Election",
    price: "31,526",
  },
  {
    img: "/images/dash_check.png",
    color: "#ECFBFF",
    img_dark: "/images/dash_check_dark.png",
    title: "Active Election",
    price: 230,
  },
  {
    img: "/images/dash_vote.png",
    color: "#EDFFEF",
    img_dark: "/images/dash_vote_dark.png",
    title: "Closed Election",
    price: 1253,
  },
];

class Elections extends React.Component {
  constructor() {
    super();
    this.state = {
      personName: [],
      elections: [],
      realElections: [],
      active: 0,
      ended: 0,
      keyword: "",
    };
    this.handleSearch = this.handleSearch.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange = (event) => {
    const {
      target: { value },
    } = event;
    this.setState({
      personName: value,
    });
  };

  async componentWillReceiveProps(nextProps) {
    await this.init(nextProps);
  }

  async init(nextProps) {
    if (nextProps.account) {
      let active = 0;
      let ended = 0;
      let elections = [];
      let electionCount = await daoContract.methods.proposalIndex().call();
      for (let i = 0; i < electionCount; i++) {
        const election = await daoContract.methods.proposals(i).call();
        if (election.isVoteEnded) {
          ended++;
        } else {
          active++;
        }
        elections.push(election);
      }
      this.setState({
        elections: elections,
        realElections: elections,
        active: active,
        ended: ended,
      });
    }
  }

  async componentWillMount() {
    await this.init(this.props);
  }

  async handleSearch(e) {
    const realElections = this.state.elections.filter((element) =>
      element.name.toLowerCase().includes(e.target.value.toLowerCase())
    );

    this.setState({
      keyword: e.target.value,
      realElections: realElections,
    });
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
              pl: this.props.matchUpMd ? 7 : 2,
              "&::after": {
                content: `""`,
                background: "url(/images/background.png)",
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: -1,
              },
            }}
          >
            <Typography variant="h3">Elections</Typography>
            <Stack
              flexDirection={this.props.matchUpMd ? "row" : "column"}
              gap={this.props.matchUpLg ? 9 : 6}
              justifyContent="center"
              sx={{ pt: 4, px: this.props.matchUpMd ? 4 : 2 }}
            >
              {cards.map((element, key) => (
                <Stack
                  justifyContent="space-between"
                  key={key}
                  flex={1}
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
                  <Typography variant="h1" sx={{ textAlign: "center" }}>
                    {key === 0
                      ? this.state.elections.length
                      : key === 1
                      ? this.state.active
                      : this.state.ended}
                  </Typography>
                </Stack>
              ))}
            </Stack>
          </Box>
        </Box>
        <Box
          sx={{
            pt: 4,
            px: this.props.matchUpMd ? 7 : 2,
          }}
        >
          <Stack
            flexDirection="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ pb: 1 }}
          >
            <Typography variant="h3">Election Status</Typography>
            <Stack flexDirection="row" alignItems="center" gap={4}>
              <OutlinedInput
                size="small"
                endAdornment={
                  <IconButton size="small">
                    <SearchIcon fontSize="small" />
                  </IconButton>
                }
                sx={{
                  borderRadius: 12,
                }}
                value={this.state.keyword}
                onChange={this.handleSearch}
              />
              {/* <FormControl>
                                <Select
                                    // variant="filled"
                                    // multiple
                                    displayEmpty
                                    value={this.state.personName}
                                    onChange={this.handleChange}
                                    input={<OutlinedInput />}
                                    renderValue={(selected) => {
                                        if (selected.length === 0) {
                                        return "Latest"
                                        }

                                        return selected
                                    }}
                                    size="small"
                                    MenuProps={MenuProps}
                                    inputProps={{ 'aria-label': 'Without label' }}
                                    sx={{
                                        '& .MuiOutlinedInput-notchedOutline': {
                                            border: 'none'
                                        }
                                    }}
                                >
                                {names.map((name, key) => (
                                    <MenuItem
                                        key={key}
                                        value={name}
                                    >
                                    {name}
                                    </MenuItem>
                                ))}
                                </Select>
                            </FormControl> */}
            </Stack>
          </Stack>
          <Stack gap={2}>
            {this.state.realElections.map((element, key) => (
              <Stack
                flexDirection={this.props.matchUpMd ? "row" : "column"}
                key={key}
                // onClick={() => this.props.navigate(`/elections/${(element.id / 1)}`)}
                sx={{
                  p: 1,
                  border: "1px solid",
                  borderColor:
                    this.props.theme.palette.mode === "dark"
                      ? "#323232"
                      : "#CBCBCB",
                  borderRadius: 2,
                  "&:hover": {
                    cursor: "pointer",
                    borderColor:
                      this.props.theme.palette.mode === "dark"
                        ? "#8F8F8F"
                        : "#323232",
                    boxShadow: `0px 6px 6px rgba(0, 0, 0, 0.07)`,
                    "&>div:first-child": {
                      borderColor:
                        this.props.theme.palette.mode === "dark"
                          ? "#8F8F8F"
                          : "#323232",
                      "& svg path": {
                        stroke:
                          this.props.theme.palette.mode === "dark"
                            ? "#8F8F8F"
                            : "#323232",
                      },
                    },
                  },
                }}
                gap={2}
              >
                <Stack
                  alignItems="center"
                  justifyContent="center"
                  sx={{
                    borderRadius: 1,
                    px: 2,
                    border: "1px solid",
                    borderColor:
                      this.props.theme.palette.mode === "dark"
                        ? "#323232"
                        : "#CBCBCB",
                    width: 100,
                    height: 100,
                  }}
                >
                  {element.source ? (
                    <Box
                      src={element.source}
                      component="img"
                      sx={{ width: "100%" }}
                    />
                  ) : (
                    <ElectionIcon
                      color={
                        this.props.theme.palette.mode === "dark"
                          ? "#323232"
                          : "#CBCBCB"
                      }
                    />
                  )}
                </Stack>
                <Stack gap={1} flex="auto">
                  <Typography variant="subtitle1">{element.name}</Typography>
                  <Stack flexDirection="row" alignItems="center">
                    <Typography
                      variant="body2"
                      sx={{ color: this.props.theme.palette.text.secondary }}
                    >
                      Leading :{" "}
                    </Typography>
                    <Typography variant="body2">&nbsp;No</Typography>
                  </Stack>
                  <Stack
                    flexDirection={this.props.matchUpMd ? "row" : "column"}
                    alignItems="center"
                    justifyContent="space-between"
                    sx={{ pt: 1 }}
                    gap={this.props.matchUpMd ? 0 : 2}
                  >
                    <Stack
                      flexDirection={this.props.matchUpMd ? "row" : "column"}
                      justifyContent="flex-start"
                      alignItems="center"
                      gap={4}
                    >
                      <Stack
                        flexDirection="row"
                        alignItems="center"
                        justifyContent="flex-start"
                        gap={1}
                      >
                        <Chip
                          label={
                            <Typography
                              variant="caption"
                              sx={{
                                color: element.isVoteEnded
                                  ? this.props.theme.palette.error.main
                                  : this.props.theme.palette.success.main,
                              }}
                            >
                              {element.isVoteEnded ? "Ended" : "Active"}
                            </Typography>
                          }
                          variant="outlined"
                          size="small"
                        />
                        <Chip
                          label={
                            <Typography
                              variant="caption"
                              color="paper"
                              sx={{
                                color:
                                  element.status === 0
                                    ? this.props.theme.palette.success.main
                                    : element.status === 1
                                    ? this.props.theme.palette.error.main
                                    : this.props.theme.palette.info.main,
                              }}
                            >
                              {element.status === 0
                                ? "Accepted"
                                : element.status === 1
                                ? "Rejected"
                                : "Pending"}
                            </Typography>
                          }
                          size="small"
                        />
                      </Stack>
                      <Stack flexDirection="row" alignItems="center" gap={1}>
                        <Typography
                          variant="body2"
                          sx={{
                            color: this.props.theme.palette.text.secondary,
                          }}
                        >
                          Peoples who voted
                        </Typography>
                        <Stack flexDirection="row" alignItems="center" gap={3}>
                          <Stack
                            flexDirection="row"
                            alignItems="center"
                            gap={1}
                          >
                            <ThumbUpAltOutlinedIcon fontSize="small" />
                            <Typography variant="body2">
                              {element.NumberOfYesMenber / 1}
                            </Typography>
                          </Stack>
                          <Stack
                            flexDirection="row"
                            alignItems="center"
                            gap={1}
                          >
                            <ThumbDownOutlinedIcon
                              fontSize="small"
                              sx={{
                                color: this.props.theme.palette.text.secondary,
                              }}
                            />
                            <Typography variant="body2">
                              {element.NumberOfNoMember / 1}
                            </Typography>
                          </Stack>
                        </Stack>
                      </Stack>
                      <Stack flexDirection="row" alignItems="center" gap={1}>
                        <Typography
                          variant="body2"
                          sx={{
                            color: this.props.theme.palette.text.secondary,
                          }}
                        >
                          Total tokens voted
                        </Typography>
                        <Stack flexDirection="row" alignItems="center" gap={3}>
                          <Stack
                            flexDirection="row"
                            alignItems="center"
                            gap={1}
                          >
                            <ThumbUpAltOutlinedIcon fontSize="small" />
                            <Typography variant="body2">
                              {element.votesForYes / 1}
                            </Typography>
                          </Stack>
                          <Stack
                            flexDirection="row"
                            alignItems="center"
                            gap={1}
                          >
                            <ThumbDownOutlinedIcon
                              fontSize="small"
                              sx={{
                                color: this.props.theme.palette.text.secondary,
                              }}
                            />
                            <Typography variant="body2">
                              {element.votesForNo / 1}
                            </Typography>
                          </Stack>
                        </Stack>
                      </Stack>
                    </Stack>
                    <Stack flexDirection="row" alignItems="center" gap={1}>
                      <AccessTimeOutlinedIcon
                        sx={{ color: this.props.theme.palette.text.secondary }}
                      />
                      <Typography
                        variant="body2"
                        sx={{ color: this.props.theme.palette.text.secondary }}
                      >
                        Started at {unixStamp(element.createdAt / 1)}
                      </Typography>
                    </Stack>
                  </Stack>
                </Stack>
              </Stack>
            ))}
          </Stack>
        </Box>
      </Box>
    );
  }
}

const withHook = (Component) => {
  return (props) => {
    const theme = useTheme();
    const { account } = useSelector((state) => state.userReducer);
    const matchUpMd = useMediaQuery(theme.breakpoints.up("md"));
    const matchUpLg = useMediaQuery(theme.breakpoints.up("lg"));
    const matchUpXl = useMediaQuery(theme.breakpoints.up("xl"));
    const matchUpSm = useMediaQuery(theme.breakpoints.up("sm"));
    const matchUpXs = useMediaQuery(theme.breakpoints.up("xs"));
    const navigate = useNavigate();

    return (
      <Component
        account={account}
        theme={theme}
        navigate={navigate}
        matchUpMd={matchUpMd}
        matchUpLg={matchUpLg}
        matchUpXl={matchUpXl}
        matchUpSm={matchUpSm}
        matchUpXs={matchUpXs}
        {...props}
      />
    );
  };
};

export default withHook(Elections);
