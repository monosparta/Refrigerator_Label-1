import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import "../App.css";
import SendIcon from "@mui/icons-material/Send";
import {
  Paper,
  Typography,
  Divider,
  Chip,
  styled,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import { createTheme, ThemeProvider } from "@mui/material/styles";

export default function ResponsiveDialog(props) {
  const [open, setOpen] = React.useState(false);
  const [mailContent, setMailContent] = React.useState();
  const [chipData, setChipData] = React.useState([]);

  const handleClickOpen = () => {
    setOpen(true);
    const mail_people = props.handleMailPeople();
    setChipData(mail_people);
  };

  const sendMail = async(e) => {
    e.preventDefault();
    let mail_users = "";
    chipData.forEach(function (item) {
      mail_users += item["mail"] + ",";
    });
    await props.handleSendMail(mail_users, mailContent);
    setOpen(false);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const onChangeContent = (e) => {
    const mail_content = e.target.value;
    setMailContent(mail_content);
  };

  const ListItem = styled("li")(({ theme }) => ({
    margin: theme.spacing(0.5),
  }));

  const handleDelete = (chipToDelete) => () => {
    setChipData((chips) =>
      chips.filter((chip) => chip.key !== chipToDelete.key)
    );
  };

  const theme = createTheme({
    palette: {
      Button: {
        main: "#363F4E",
      },
    },
  });
  return (
    <div>
      <ThemeProvider theme={theme}>
        <Button
          onClick={handleClickOpen}
          endIcon={<SendIcon />}
          color="Button"
          variant="outlined"
        >
          寄信提醒
        </Button>
      </ThemeProvider>
      <Dialog open={open} onClose={handleClose}>
        <Paper sx={{ width: 440, height: 300 }}>
          <form>
            <DialogTitle>
              <Typography variant="h6" sx={{ fontWeight: 700 }} align="center">
                寄送到期提醒信件
              </Typography>
            </DialogTitle>
            <DialogContent sx={{ height: 160 }}>
              <div className="owner" display="flex">
                <Typography
                  variant="h7"
                  sx={{ fontWeight: 700 }}
                  className="ownertext"
                >
                  物品所屬人
                </Typography>
                <div className="chips">
                  <Paper
                    type="email"
                    className="form-control"
                    name="email"
                    sx={{
                      display: "flex",
                      justifyContent: "left",
                      flexWrap: "wrap",
                      listStyle: "none",
                      p: 0.5,
                      m: 0,
                      height: 40,
                      width: 300,
                      // border: 1,
                    }}
                    component="ul"
                    elevation={0}
                  >
                    {chipData.map((data) => {
                      let icon;
                      return (
                        <ListItem key={data.key}>
                          <Chip
                            icon={icon}
                            label={data.label}
                            onDelete={
                              data.label === "React"
                                ? undefined
                                : handleDelete(data)
                            }
                          />
                        </ListItem>
                      );
                    })}
                  </Paper>
                  <Divider sx={{ width: 300 }} />
                </div>
              </div>
              <div className="mailcontent" display="flex">
                <Typography
                  variant="h7"
                  sx={{ fontWeight: 700 }}
                  className="ownertext"
                >
                  提醒內容
                </Typography>
                <div className="contentBox">
                  <TextareaAutosize
                    className="mail_content"
                    id="mail_content"
                    placeholder="請輸入提醒內容"
                    onChange={onChangeContent}
                    name="mail_content"
                    style={{ height: 100, width: 300 }}
                  />
                </div>
              </div>
            </DialogContent>
            <DialogActions>
              <div className="ButtonGroup">
                <ThemeProvider theme={theme}>
                  <Button
                    type="submit"
                    onClick={sendMail}
                    disableElevation
                    variant="contained"
                    color="Button"
                    style={{
                      maxWidth: "108px",
                      maxHeight: "36px",
                      minWidth: "108px",
                      minHeight: "36px",
                    }}
                  >
                    <Typography
                      variant="h7"
                      color="white"
                      sx={{ fontWeight: 500 }}
                    >
                      確認
                    </Typography>
                  </Button>
                  <Button
                    onClick={handleClose}
                    className="BtnNosend"
                    disableElevation
                    variant="outlined"
                    color="Button"
                    style={{
                      maxWidth: "108px",
                      maxHeight: "36px",
                      minWidth: "108px",
                      minHeight: "36px",
                    }}
                  >
                    取消
                  </Button>
                </ThemeProvider>
              </div>
            </DialogActions>
          </form>
        </Paper>
      </Dialog>
    </div>
  );
}
