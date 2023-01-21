import { useState, useContext } from "react";
import PropTypes from "prop-types";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { Box, Stack, Avatar, Button, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

export default function PokePicker({ user }) {
  const { setUser } = useContext(AuthContext);
  const [selection, setSelection] = useState(null);
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: ["starters", user.username],
    queryFn: async () => {
      const resp = await axios.get("http://localhost:8080/starters", {
        headers: {
          Authorization: user.username,
        },
      });
      return resp.data;
    },
  });

  const mutation = useMutation(
    async (id) => {
      const resp = await axios.post(
        "http://localhost:8080/pokemons",
        { id },
        {
          headers: { Authorization: user.username },
        }
      );
      return resp.data;
    },
    {
      onSuccess: (data) => {
        queryClient.setQueryData(["pokemon"], data);
        const updatedUser = { ...user, pokemon_id: data.starter.id };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
      },
    }
  );

  const handleConfirm = () => {
    mutation.mutate(selection);
  };

  const starters = query.data?.starters;

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
      {query.isError && <em>Something went wrong. {starters.error.message}</em>}
      {query.isLoading && <em>Loading...</em>}
      <Stack spacing={4}>
        {starters?.map((pkmn) => (
          <Stack key={pkmn.id} direction={"row"}>
            <Avatar
              sx={{ width: 92, height: 92 }}
              alt={pkmn.name}
              src={pkmn.sprites.front_default}
            />
            <Stack spacing={2}>
              <Typography variant={"h4"}>{pkmn.name}</Typography>
              <Typography variant={"body1"}>
                <strong>Type:</strong>{" "}
                {pkmn.types.map((type) => type.type.name).join(", ")}
              </Typography>
              <Typography variant={"body1"}>
                <strong>Abilities:</strong>{" "}
                {pkmn.abilities
                  .map((ability) => ability.ability.name)
                  .join(", ")}
              </Typography>
              <Stack direction="row">
                {!selection && (
                  <Button
                    onClick={() => setSelection(pkmn.id)}
                    variant={"outlined"}
                  >
                    Select {pkmn.name}
                  </Button>
                )}
                {selection === pkmn.id && (
                  <>
                    <LoadingButton
                      loading={mutation.isLoading}
                      onClick={handleConfirm}
                      variant={"contained"}
                    >
                      Confirm
                    </LoadingButton>
                    <Button
                      disabled={mutation.isLoading}
                      onClick={() => setSelection(null)}
                    >
                      Go back
                    </Button>
                  </>
                )}
              </Stack>
            </Stack>
          </Stack>
        ))}
      </Stack>
    </Box>
  );
}

PokePicker.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.number.isRequired,
    username: PropTypes.string.isRequired,
    pokemon_id: PropTypes.number,
  }).isRequired,
};
