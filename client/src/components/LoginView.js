import { useState, useContext } from "react";
import { Stack, TextField, Box, Alert } from "@mui/material";
import { useMutation } from "react-query";
import axios from "axios";
import LoadingButton from "@mui/lab/LoadingButton";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Navigate } from "react-router-dom";

export default function LoginView() {
  const [username, setUsername] = useState("");
  const { signIn, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const mutation = useMutation(
    async (login) => {
      const resp = await axios.post("http://localhost:8080/login", login);
      return resp.data;
    },
    {
      onSuccess: ({ user }) => {
        signIn(user);
        navigate("/dashboard");
      },
    }
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate({ username });
  };

  if (user) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Stack
        sx={{ width: 300 }}
        spacing={2}
        component="form"
        noValidate
        autoComplete="off"
        onSubmit={handleSubmit}
      >
        {mutation.isError ? (
          <Alert severity="error">
            An error occurred: {mutation.error.message}
          </Alert>
        ) : null}
        <TextField
          id="username"
          label="Username"
          variant="outlined"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <LoadingButton
          loading={mutation.isLoading}
          id="login"
          variant="outlined"
          type="submit"
        >
          Login
        </LoadingButton>
      </Stack>
    </Box>
  );
}
