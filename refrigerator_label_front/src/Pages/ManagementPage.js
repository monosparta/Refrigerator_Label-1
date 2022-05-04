import * as React from "react";
import Bar from "../Components/AppBar";
import axios from "../Axios.config.js";
import { DataGrid } from "@mui/x-data-grid";
import { Button, TextField, Typography, Chip } from "@mui/material";
import { Box } from "@mui/system";
import DeleteBtn from "../Components/DeleteBtn";
import { useNavigate } from "react-router-dom";
import MailBtn from "../Components/MailBtn";
import MuiAlert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import SendIcon from "@mui/icons-material/Send";
// import DeleteConfirmDialog from "../Components/DeleteConfirmDialog";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    Button: {
      main: "#363F4E",
    },
  },
});

// 我為Menu功能，進行中文化，但我鎖住了，不用理
const localizedTextsMap = {
  columnMenuUnsort: "原始排列",
  columnMenuSortAsc: "升序排列",
  columnMenuSortDesc: "降序排列",
  columnMenuFilter: "篩選",
  columnMenuHideColumn: "隱藏此列",
  columnMenuShowColumns: "顯示此列",
  footerRowSelected: (count) => `已選擇 ${count} 項 `,
};

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function ManagementPage() {
  let navigate = useNavigate();

  // label_data
  const [rowData, setRowData] = React.useState([]);
  // select_data_id
  const [select_data_id, setSelectDataId] = React.useState([]);
  //snackbar
  const [state, setState] = React.useState({
    open: false,
    vertical: "top",
    horizontal: "center",
  });
  //Alert的文字
  const [AlertText, setAlertText] = React.useState("");
  //關掉Alert
  const handleClose = () => {
    setState({ ...state, open: false });
  };
  const { vertical, horizontal, open } = state;
  //儲存功能
  const handleUpdate = (id) => async () => {
    await axios
      .put(
        "api/label",
        {
          id: id,
          note: note,
        },
        { headers: { token: localStorage.getItem("login_token") } }
      )
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
    setState({
      open: true,
      ...{
        vertical: "top",
        horizontal: "center", //position of popout
      },
    });
    setAlertText("儲存成功");
  };
  //備註
  const [note, setNote] = React.useState("");
  //備註寫入
  const onChangeNote = (e) => {
    const note = e.target.value;
    setNote(note);
  };

  const loadingData = React.useCallback(() => {
    const loadData = async () => {
      await axios
        .get("api/find_label_all", {
          headers: { token: localStorage.getItem("login_token") },
        })
        .then((response) => {
          const label_data = response["data"]["message"];
          setRowData(label_data);
        })
        .catch((error) => {
          console.log(error.response.data["message"]);
          //overtime
          if (error.response.status === 402 || 403) {
            localStorage.removeItem("login_token");
            navigate("/");
          }
        });
    };
    loadData();
  }, [navigate]);

  React.useEffect(() => {
    loadingData();
  }, [loadingData]);

  const getSelectData = (field) => {
    const select_data = [];
    rowData.forEach(function (each_label) {
      select_data_id.forEach(function (select_label_id) {
        if (each_label["id"] === select_label_id) {
          select_data.push(each_label[field]);
        }
      });
    });
    return select_data;
  };
  //刪除功能
  const handleDelete = async (newState) => {
    const delete_data = getSelectData("label_id");

    await axios
      .delete("api/label", {
        headers: { token: localStorage.getItem("login_token") },
        data: { label_id: delete_data },
      })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error.response.data["message"]);
        //overtime
        if (error.response.status === 402 || 403) {
          localStorage.removeItem("login_token");
          navigate("/");
        }
      });

    loadingData();
    setAlertText("刪除成功");
    setState({
      open: true,
      ...{
        vertical: "top",
        horizontal: "center",
      },
    });
  };
  //讀取要寄信的人
  const handleMailPeople = () => {
    const get_mail_people = getSelectData("name");
    const get_mail_label_id = getSelectData("label_id");
    const get_mail_data = getSelectData("mail");
    const people = [];

    for (let count = 0; count < get_mail_people.length; count++) {
      people.push({
        key: count,
        label: get_mail_people[count] + "-" + get_mail_label_id[count],
        mail: get_mail_data[count],
      });
    }
    return people;
  };
  //寄信功能
  const handleSendMail = async (mail_users, mail_content, newState) => {
    await axios
      .get("api/manual_send_mail", {
        headers: { token: localStorage.getItem("login_token") },
        params: {
          users: mail_users,
          subject: "Mono冰箱主動提醒通知",
          text: mail_content,
        },
      })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error.response.data["message"]);
        //overtime
        if (error.response.status === 402 || 403) {
          localStorage.removeItem("login_token");
          navigate("/");
        }
      });
    setAlertText("寄信成功");
    setState({
      open: true,
      ...{
        vertical: "top",
        horizontal: "center",
      },
    });
    setSelectDataId([]);
  };

  // data grid columns definition
  const columns = [
    {
      field: "name",
      headerName: "物品所屬者",
      width: 120,
      disableColumnMenu: true,
      sortable: false,
    },
    {
      field: "label_id",
      headerName: "ID",
      width: 110,
      disableColumnMenu: true,
      sortable: false,
    },
    {
      field: "date",
      headerName: "放入日期",
      type: "date",
      width: 220,
      disableColumnMenu: true,
      renderCell: (params) => {
        const string = params.value.split("- ");
        let chip_color = "#6cba6f";
        if (params.value.split("- ").pop().split(" day ago")[0] >= 7) {
          chip_color = "#ee9852";
        }
        return (
          <div>
            {string[0]}
            <Chip
              size="small"
              label={string[1]}
              color="primary"
              sx={{ backgroundColor: chip_color, borderRadius: "8px", ml: 1 }}
            />
          </div>
        );
      },
    },
    {
      field: "note",
      type: "actions",
      headerName: "備註",
      width: 200,
      disableColumnMenu: true,
      sortable: false,
      getActions: (params) => {
        return [
          <TextField
            size="small"
            placeholder="編輯備註"
            value={params.row.note}
            onChange={onChangeNote}
          />,
        ];
      },
    },
    {
      field: "actions",
      type: "actions",
      width: 100,
      cellClassName: "actions",
      getActions: (params) => {
        return [
          <ThemeProvider theme={theme}>
            <Button
              onClick={handleUpdate(params.id)}
              color="Button"
              variant="contained"
              disableElevation
            >
              <Typography color="white" variant="h7" sx={{ fontWeight: "500" }}>
                儲存
              </Typography>
            </Button>
          </ThemeProvider>,
        ];
      },
    },
  ];

  return (
    <div className="Home">
      <Bar />
      <Box style={{ height: 1100, width: "100%" }} className="DataGrid">
        <ThemeProvider theme={theme}>
          <Box
            variant="outlined"
            color="Button"
            sx={{ margin: 2, marginLeft: 70 }}
            display="flex"
          >
            <DeleteBtn handleDelete={handleDelete} className="DeleteBtn" />
            <MailBtn
              endIcon={<SendIcon />}
              handleSendMail={handleSendMail}
              handleMailPeople={handleMailPeople}
              className="MailBtn"
            />
          </Box>
        </ThemeProvider>
        <DataGrid
          sx={{ display: "flex", flexDirection: "column-reverse" }}
          rows={rowData}
          columns={columns}
          pageSize={100}
          rowsPerPageOptions={[5]}
          checkboxSelection
          disableSelectionOnClick
          localeText={localizedTextsMap}
          onSelectionModelChange={(details) => {
            setSelectDataId(details);
          }}
          selectionModel={select_data_id}
        />
      </Box>
      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={open}
        autoHideDuration={1500}
        onClose={handleClose}
        key={vertical + horizontal}
      >
        <Alert onClose={handleClose} severity="success" sx={{ width: "100%" }}>
          {AlertText}
        </Alert>
      </Snackbar>
      {/* <DeleteConfirmDialog open={open} /> */}
    </div>
  );
}
