import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import HomeIcon from "@mui/icons-material/Home";
import LogoutIcon from "@mui/icons-material/Logout";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import { AppBar, Toolbar, IconButton, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function BottomAppBar() {
  const navigate = useNavigate();
  const { signOut } = useContext(AuthContext);

  const handleSignOut = () => {
    signOut();
    navigate("/");
  };

  return (
    <AppBar
      position="fixed"
      color="primary"
      sx={{ width: "100%", top: "auto", bottom: 0 }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-around",
          width: "100%",
          top: "auto",
          bottom: 0,
        }}
      >
        <IconButton onClick={() => navigate("/")}>
          <HomeIcon />
        </IconButton>
        <IconButton>
          <AttachMoneyIcon onClick={() => navigate("/shop")} />
        </IconButton>
        <IconButton>
          <ShoppingBagIcon onClick={() => navigate("/items")} />
        </IconButton>
        <IconButton>
          <LogoutIcon onClick={handleSignOut} />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}
