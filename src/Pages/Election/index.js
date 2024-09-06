import React from "react";
import {
  Box,
  Stack,
  Typography,
  IconButton,
  Button,
  Chip,
  Divider,
  LinearProgress,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
// import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { unixStamp } from "../../Utils/date";
import Web3 from "web3";
import {
  RPC,
  vrtABI,
  vrtAddress,
  daoABI,
  daoAddress,
} from "../../Constants/config";

const web3 = new Web3(new Web3.providers.HttpProvider(RPC));
const daoContract = new web3.eth.Contract(daoABI, daoAddress);
const vrtContract = new web3.eth.Contract(vrtABI, vrtAddress);

class Election extends React.Component {
  constructor() {
    super();
    this.state = {
      election: {},
      owner: "",
      admin: "",
      id: null,
    };
  }

  async componentWillReceiveProps(nextProps) {
    await this.init(nextProps);
  }

  async init(nextProps) {
    if (nextProps.account) {
      const owner = await daoContract.methods.owner().call();
      const admin = await daoContract.methods.admin().call();
      const { id } = this.props.params;
      this.setState({
        id: id,
      });

      const election = await daoContract.methods.proposals(id).call();
      const vote = await daoContract.methods
        .votesHistory(this.props.account, election.id / 1)
        .call();
      election.vote = vote;
      console.log(election);

      this.setState({
        election: election,
        owner: owner,
        admin: admin,
      });
    }
  }

  async componentWillMount() {
    await this.init(this.props);
  }

  async vote(proposalID, trueOrFalse) {
    if (this.state.position === "GUEST") {
      alert("You are not a Member!");
    }

    const balance = await vrtContract.methods
      .balanceOf(this.props.account)
      .call();
    if (balance === 0) {
      alert("you are not a member of Vegan Rob's DAO");
      return;
    }

    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: web3.utils.toHex(1666600000) }],
    });

    const linkedContract = new web3.eth.Contract(daoABI, daoAddress);
    await linkedContract.methods
      .vote(proposalID, trueOrFalse)
      .send({ from: this.props.account })
      .once("confirmation", async () => {
        this.init();
      });
  }

  async closeVote(proposalID) {
    if (
      this.props.account !== this.state.owner &&
      this.props.account !== this.state.admin
    ) {
      alert("you dont have a permission");
    }

    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: web3.utils.toHex(1666600000) }],
    });

    const linkedContract = new web3.eth.Contract(daoABI, daoAddress);
    await linkedContract.methods
      .stopVoting(proposalID)
      .send({ from: this.props.account })
      .once("confirmation", async () => {
        alert("Successfully Closed");
        this.init(this.props);
      });
  }

  render() {
    return (
      <Box
        sx={{
          p: 1.5,
          pb: 7,
          bgcolor: this.props.theme.palette.background.neutral,
        }}
      >
        <Stack
          flexDirection="row"
          alignItems="flex-start"
          gap={6}
          sx={{
            bgcolor: this.props.theme.palette.background.default,
            p: 1.5,
          }}
        >
          <Stack flexDirection="row" alignItems="flex-start" flex={3} gap={1}>
            <IconButton
              size="small"
              onClick={() => this.props.navigate(-1)}
              sx={{
                bgcolor:
                  this.props.theme.palette.mode === "dark"
                    ? "#323232"
                    : "#EDEDED",
              }}
            >
              <ChevronLeftIcon fontSize="small" />
            </IconButton>
            <Box>
              <Typography variant="subtitle1">
                {this.state.election.name}
              </Typography>
              <Stack
                flexDirection="row"
                alignItems="center"
                gap={1}
                sx={{ pt: 1 }}
              >
                <Chip
                  label={
                    <Typography
                      variant="caption"
                      sx={{
                        color: this.state.election.isVoteEnded
                          ? this.props.theme.palette.error.main
                          : this.props.theme.palette.success.main,
                      }}
                    >
                      {this.state.election.isVoteEnded ? "Ended" : "Active"}
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
                          this.state.election.status === 0
                            ? this.props.theme.palette.success.main
                            : this.state.election.status === 1
                            ? this.props.theme.palette.error.main
                            : this.props.theme.palette.info.main,
                      }}
                    >
                      {this.state.election.status === 0
                        ? "Accepted"
                        : this.state.election.status === 1
                        ? "Rejected"
                        : "Pending"}
                    </Typography>
                  }
                  size="small"
                />
              </Stack>
              {/* <Box sx={{ pt: 5 }}>
                                <Typography variant="body2" sx={{ color: this.props.theme.palette.text.secondary }}>
                                    Should the following Tier 4: up to $60,000 USD, 6 months vesting (1 month cliff) grant in the Platform Contributor category be approved?
                                </Typography>
                                <Typography sx={{ color: this.props.theme.palette.text.secondary, py: 3 }}>ABSTRACT</Typography>
                                <Typography variant="body2" sx={{ color: this.props.theme.palette.text.secondary }}>
                                    We would love to have a 2D client for Decentraland that allows anyone to create and play 2D games. We are proposing a 2D client prototype
                                    that allows you to walk around Decentraland. We think that a 2D game client would help expand the Decentraland ecosystem by providing
                                    an alternative way to create content in Decentraland.GRANT SIZE
                                    60,000 USD
                                    BENEFICIARY ADDRESS
                                    0xa63A3eeE0101e61f3c970445A237ED04785ad145
                                    DESCRIPTION
                                </Typography>
                                <Typography sx={{ color: this.props.theme.palette.text.secondary, py: 3 }}>
                                    Background
                                </Typography>
                                <Typography variant="body2" sx={{ color: this.props.theme.palette.text.secondary }}>
                                    After Reading maraoz's blog post about his vision for Decentraland, I (frantufro) started to get interested in Decentraland's potential as an
                                    open-source metaverse. Up until then my opinion about crypto gaming (including Decentraland) was rooted in the current state of Play-to
                                    -Earn games and their mostly speculative nature. Our initial discussions on the topic made me realize how shortsighted I was about the
                                    potential of a platform like Decentraland. We both want to see an open-source alternative to Meta. We also know that there's a lot of work to
                                    be done to get there. This proposal is our first step towards that vision.
                                </Typography>
                                <Typography sx={{ color: this.props.theme.palette.text.secondary, py: 3 }}>
                                    Vision
                                </Typography>
                                <Typography variant="body2" sx={{ color: this.props.theme.palette.text.secondary }}>
                                    We would love to see a thriving community of Decentraland game creators enabled by an ecosystem of tools that support them. Besides the
                                    original 3D client developed by the Decentraland Foundation, we think that 2D experiences should definitely be a part of this ecosystem,
                                    and we want to take the lead in creating such tools. The long-term vision for this project is to allow the community to easily create 2D retro
                                    games on Decentraland, with enough flexibility to support multiple types of 2D games. To achieve this, we propose first building a prototype
                                    of an independent 2D retro client to walk around Decentraland, including scenes and some wearables.
                                </Typography>
                                <Box sx={{ py: 2 }}>
                                    <Divider />
                                </Box>
                                <Box sx={{ pb: 3 }}>
                                    <Typography>Comments</Typography>
                                    <Stack gap={4} sx={{ pt: 3, pl: 9 }}>
                                        <Stack gap={3}>
                                            <Stack flexDirection="row" alignItems="flex-end" gap={1} >
                                                <Typography variant="caption">maraoz</Typography>
                                                <Typography variant="caption" sx={{ color: this.props.theme.palette.text.disabled }}>a day ago</Typography>
                                            </Stack>
                                            <Typography variant="body2" sx={{ color: this.props.theme.palette.text.secondary }}>
                                                Great to see this out.
                                                I' ve been heling fra
                                            </Typography>
                                        </Stack>
                                        <Stack gap={3}>
                                            <Stack flexDirection="row" alignItems="flex-end" gap={1} >
                                                <Typography variant="caption">maraoz</Typography>
                                                <Typography variant="caption" sx={{ color: this.props.theme.palette.text.disabled }}>a day ago</Typography>
                                            </Stack>
                                            <Typography variant="body2" sx={{ color: this.props.theme.palette.text.secondary }}>
                                                Great to see this out.
                                                I' ve been heling fra
                                            </Typography>
                                        </Stack>
                                    </Stack>
                                </Box>
                                <Box>
                                    <Button 
                                        variant="outlined" 
                                        fullWidth 
                                        size="large"
                                        color="error"
                                        sx={{
                                            borderColor: this.props.theme.palette.divider
                                        }}
                                    >
                                        <Typography variant="body2">Comment on this proposal</Typography>
                                    </Button>
                                </Box>
                            </Box> */}
            </Box>
          </Stack>
          <Stack flex={1} gap={2.5}>
            <Box>
              <Button
                fullWidth
                variant="outlined"
                size="large"
                onClick={() => this.vote(this.state.id, true)}
                sx={{
                  color: this.props.theme.palette.text.primary,
                  borderColor: this.props.theme.palette.success.main,
                }}
              >
                Vote :&nbsp;<strong>YES</strong>
              </Button>
            </Box>
            <Box>
              <Button
                fullWidth
                variant="outlined"
                size="large"
                onClick={() => this.vote(this.state.id, false)}
                sx={{
                  color: this.props.theme.palette.text.primary,
                  borderColor: "#A953FF",
                }}
              >
                Vote :&nbsp;<strong>NO</strong>
              </Button>
            </Box>
            {this.state.admin !== "" &&
            (this.state.admin === this.props.account ||
              this.state.owner === this.props.account) ? (
              <Box>
                <Button
                  fullWidth
                  variant="outlined"
                  size="large"
                  onClick={() => this.closeVote(this.state.id)}
                >
                  Close Voting
                </Button>
              </Box>
            ) : (
              <></>
            )}
            <Stack
              sx={{
                borderRadius: 2,
                border: `1px solid ${this.props.theme.palette.divider}`,
                width: "100%",
                height: 220,
                p: 2,
              }}
              justifyContent="center"
              alignItems="center"
            >
              <Box
                component="img"
                src={
                  this.state.election.source
                    ? this.state.election.source
                    : "/images/election.png"
                }
                sx={{ maxWidth: "100%", maxHeight: "100%" }}
              />
            </Stack>
            <Box sx={{ p: 2, borderRadius: 2, border: `1px solid #CBCBCB` }}>
              <Stack gap={2.5}>
                <Typography variant="body2" sx={{ textTransform: "uppercase" }}>
                  Details
                </Typography>
                <Stack gap={3}>
                  {/* <Stack flexDirection="row" alignItems="center" justifyContent="space-between">
                                        <Typography variant="body2" sx={{ fontWeight: 300 }}>Created by</Typography>
                                        <Stack flexDirection="row" alignItems="center" justifyContent="space-between" gap={1}>
                                            <Avatar sx={{ width: 24, height: 24 }} />
                                            <Typography variant="body2" sx={{ fontWeight: 600, color: this.props.theme.palette.error.main }}>frantufro</Typography>
                                        </Stack>
                                    </Stack> */}
                  <Stack
                    flexDirection="row"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Typography variant="body2" sx={{ fontWeight: 300 }}>
                      Started
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {this.state.election.createdAt
                        ? unixStamp(this.state.election.createdAt / 1)
                        : ""}
                    </Typography>
                  </Stack>
                  <Stack
                    flexDirection="row"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Typography variant="body2" sx={{ fontWeight: 300 }}>
                      Ends
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      Jul 13 00:05
                    </Typography>
                  </Stack>
                  {/* <Stack flexDirection="row" alignItems="center" justifyContent="space-between">
                                        <Typography variant="body2" sx={{ fontWeight: 300 }}>Snapshot</Typography>
                                        <Stack flexDirection="row" alignItems="center" gap={.5}>
                                            <Typography variant="body2" sx={{ fontWeight: 600, color: this.props.theme.palette.error.main }}>#bafkrei</Typography>
                                            <Link sx={{ display: 'flex', alignItems: 'center' }}>
                                                <OpenInNewIcon 
                                                    color="error" fontSize="small" 
                                                    onClick={() => this.props.navigate('/elections/1/snapshot')} 
                                                    sx={{ cursor: 'pointer' }}
                                                />
                                            </Link>
                                        </Stack>
                                    </Stack> */}
                </Stack>
              </Stack>
            </Box>
            <Box sx={{ borderRadius: 2, border: `1px solid #CBCBCB` }}>
              <Stack gap={2.5} sx={{ p: 2 }}>
                <Stack
                  flexDirection="row"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Typography
                    variant="body2"
                    sx={{ textTransform: "uppercase" }}
                  >
                    Current Result
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ textTransform: "uppercase" }}
                  >
                    See votes
                  </Typography>
                </Stack>
                <Box>
                  <Stack
                    flexDirection="row"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Typography variant="body2">Yes</Typography>
                    <Typography variant="body2">
                      {this.state.election.voteAmount
                        ? (
                            (this.state.election.votesForYes /
                              1 /
                              this.state.election.voteAmount) *
                            100
                          ).toFixed()
                        : 0}
                      %
                    </Typography>
                  </Stack>
                  <LinearProgress
                    color="success"
                    variant="determinate"
                    value={
                      this.state.election.voteAmount
                        ? (
                            (this.state.election.votesForYes /
                              1 /
                              this.state.election.voteAmount) *
                            100
                          ).toFixed()
                        : 0
                    }
                  />
                  <Stack flexDirection="row" sx={{ pt: 1 }}>
                    <Typography variant="caption">1,327,289</Typography>
                    <Typography variant="caption">
                      (
                      {this.state.election.votesForYes
                        ? this.state.election.votesForYes / 1
                        : 0}{" "}
                      votes)
                    </Typography>
                  </Stack>
                </Box>
                <Box>
                  <Stack
                    flexDirection="row"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Typography variant="body2">No</Typography>
                    <Typography variant="body2">
                      {this.state.election.voteAmount
                        ? (
                            (this.state.election.votesForNo /
                              1 /
                              this.state.election.voteAmount) *
                            100
                          ).toFixed()
                        : 0}
                      %
                    </Typography>
                  </Stack>
                  <LinearProgress
                    color="error"
                    variant="determinate"
                    value={
                      this.state.election.voteAmount
                        ? (
                            (this.state.election.votesForNo /
                              1 /
                              this.state.election.voteAmount) *
                            100
                          ).toFixed()
                        : 0
                    }
                  />
                  <Stack flexDirection="row" sx={{ pt: 1 }}>
                    <Typography variant="caption">143,766</Typography>
                    <Typography variant="caption">
                      (
                      {this.state.election.votesForNo
                        ? this.state.election.votesForNo / 1
                        : 0}{" "}
                      votes)
                    </Typography>
                  </Stack>
                </Box>
                <Box
                  sx={{
                    p: 2,
                    pb: 0,
                    borderRadius: 2,
                    border: `1px solid #CBCBCB`,
                    "& .thumbs-wrapper": {
                      display: "none",
                    },
                    "& .carousel-slider": {
                      display: "flex",
                      flexDirection: "column-reverse",
                      "& .control-dots": {
                        position: "relative",
                      },
                    },
                  }}
                >
                  <Carousel
                    showArrows={false}
                    showThumbs={false}
                    showStatus={false}
                    autoPlay={true}
                  >
                    <Stack
                      sx={{
                        borderRadius: 2,
                        px: 2,
                        py: 1,
                        bgcolor: this.props.theme.palette.divider,
                      }}
                    >
                      <Typography variant="caption" sx={{ fontWeight: 300 }}>
                        Accpetance Threshold
                      </Typography>
                      <Typography variant="caption" sx={{ fontWeight: 500 }}>
                        2,000,000 VP
                      </Typography>
                    </Stack>
                    <Stack
                      sx={{
                        borderRadius: 2,
                        px: 2,
                        py: 1,
                        bgcolor: this.props.theme.palette.divider,
                      }}
                    >
                      <Typography variant="caption" sx={{ fontWeight: 300 }}>
                        Needed for Acceptance
                      </Typography>
                      <Typography variant="caption" sx={{ fontWeight: 500 }}>
                        671,711 VP
                      </Typography>
                    </Stack>
                  </Carousel>
                </Box>
              </Stack>
              <Box>
                <Divider />
              </Box>
              <Stack
                flexDirection="row"
                justifyContent="center"
                alignItems="center"
                sx={{ py: 3 }}
              >
                <Button color="error" sx={{ textTransform: "uppercase" }}>
                  Sign in
                </Button>
              </Stack>
            </Box>
          </Stack>
        </Stack>
      </Box>
    );
  }
}

const withHook = (Component) => {
  return (props) => {
    const theme = useTheme();
    const params = useParams();
    const navigate = useNavigate();
    const { account, position } = useSelector((state) => state.userReducer);
    return (
      <Component
        theme={theme}
        position={position}
        account={account}
        navigate={navigate}
        params={params}
        {...props}
      />
    );
  };
};
export default withHook(Election);
