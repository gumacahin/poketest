import { useState } from "react";
import PropTypes from "prop-types";
import { useQuery, useMutation, useQueryClient } from "react-query";
import {
  IconButton,
  Box,
  Stack,
  Avatar,
  Button,
  TextField,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import LoadingButton from "@mui/lab/LoadingButton";
import axios from "axios";

export default function PokeViewer({ user }) {
  const [editMode, setEditMode] = useState(false);
  const [editText, setEditText] = useState("");
  const queryClient = useQueryClient();
  const query = useQuery(
    {
      queryKey: ["pokemon"],
      queryFn: async () => {
        const resp = await axios.get("http://localhost:8080/pokemons", {
          headers: {
            Authorization: user.username,
          },
        });
        return resp.data;
      },
    },
    { enabled: Boolean(user.pokemon_id) }
  );

  const mutation = useMutation(
    async (editText) => {
      const res = await axios.put(
        "http://localhost:8080/pokemons",
        {
          name: editText,
        },
        { headers: { Authorization: user.username } }
      );
      return res.data;
    },
    {
      onSuccess: (data) => {
        queryClient.setQueryData(["pokemon"], (queryData) => ({
          ...queryData,
          starter: data.pokemon,
        }));
        handleNormalMode();
      },
    }
  );

  const handleEditMode = () => {
    setEditText(starter.name || pokemon.name);
    setEditMode(true);
  };

  const handleNormalMode = () => {
    setEditText("");
    setEditMode(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(editText);
  };

  const { pokemon, starter } = query.data || {};

  return (
    <Box
      sx={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {query.isError && <em>{`Error: ${query.error.message}`}</em>}
      {query.isLoading && <em>Loading...</em>}
      {pokemon && (
        <Box
          sx={{
            height: "100%",
            width: "100%",
            boxSizing: "border-box",
            margin: 2,
          }}
        >
          {
            <Stack
              component={"form"}
              onSubmit={handleSubmit}
              sx={{ width: "100%", boxSizing: "border-box", padding: 2 }}
            >
              {!editMode ? (
                <Stack direction="row">
                  <Typography variant={"h2"}>
                    {starter.name || pokemon.name}
                  </Typography>
                  <IconButton onClick={handleEditMode}>
                    <EditIcon fontSize="large" />
                  </IconButton>
                </Stack>
              ) : (
                <Stack direction="row" spacing={2}>
                  <TextField
                    id="nickname"
                    label="Nickname"
                    variant="outlined"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    placeholder={pokemon.name}
                  />
                  <LoadingButton
                    loading={mutation.isLoading}
                    id="login"
                    variant="outlined"
                    type="submit"
                  >
                    Confirm
                  </LoadingButton>
                  <Button onClick={handleNormalMode}>Cancel</Button>
                </Stack>
              )}
              <Typography variant={"subtitle1"} padding="2 0">
                Level {starter.level}
              </Typography>
              <Avatar
                sx={{ margin: "0 auto", width: 92, height: 92 }}
                alt={pokemon.name}
                src={pokemon.sprites.front_default}
              />
              <Typography variant={"body1"}>
                <strong>Type:</strong>{" "}
                {pokemon.types.map((type) => type.type.name).join(", ")}
              </Typography>
              <Typography variant={"body1"}>
                <strong>Abilities:</strong>{" "}
                {pokemon.abilities
                  .map((ability) => ability.ability.name)
                  .join(", ")}
              </Typography>
            </Stack>
          }
        </Box>
      )}
    </Box>
  );
}

PokeViewer.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.number.isRequired,
    username: PropTypes.string.isRequired,
    pokemon_id: PropTypes.number,
  }).isRequired,
};
