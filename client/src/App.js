import CssBaseline from "@mui/material/CssBaseline";
import {
  useNavigate,
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";
import LoginView from "./components/LoginView";
import DashboardView from "./components/DashboardView";
import ShopView from "./components/ShopView";
import ItemsView from "./components/ItemsView";
import { Stack, Button, Box, AppBar, Toolbar, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { QueryClientProvider, QueryClient } from "react-query";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AuthContextProvider } from "./context/AuthContext";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import HomeIcon from "@mui/icons-material/Home";
import LogoutIcon from "@mui/icons-material/Logout";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import BottomMenu from "./components/BottomMenu";
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthContextProvider>
        <CssBaseline />
        <Box>
          <Router>
            <Routes>
              <Route path="/" element={<LoginView />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardView />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/shop"
                element={
                  <ProtectedRoute>
                    <ShopView />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/items"
                element={
                  <ProtectedRoute>
                    <ItemsView />
                  </ProtectedRoute>
                }
              />
            </Routes>
            <BottomMenu />
          </Router>
        </Box>
      </AuthContextProvider>
    </QueryClientProvider>
  );
}

export default App;
