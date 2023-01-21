import { useContext, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import {
  Alert,
  AlertTitle,
  Avatar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Typography,
  Stack,
} from "@mui/material";

import LoadingButton from "@mui/lab/LoadingButton";

import ImageIcon from "@mui/icons-material/Image";

export default function ShopView() {
  const { user, setUser } = useContext(AuthContext);
  const [selection, setSelection] = useState(null);
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: ["shop"],
    queryFn: async () => {
      const resp = await axios.get("http://localhost:8080/shop", {
        headers: { Authorization: user.username },
      });
      return resp.data;
    },
  });

  const mutation = useMutation(
    async (id) => {
      const resp = await axios.post(
        "http://localhost:8080/items",
        { itemId: id },
        { headers: { Authorization: user.username } }
      );
      return resp.data;
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries("items");
        setUser({ ...user, cash: user.cash - data.item.price });
        setSelection(null);
      },
    }
  );

  const items = query.data?.items;

  return (
    <>
      {query.isError && (
        <Alert severity="error">
          <AlertTitle>Error</AlertTitle>
          {query.error.message}
        </Alert>
      )}
      {query.isError && <em>Loading…</em>}
      {items && (
        <Stack padding={2} spacing={2}>
          <Typography variant={"h2"}>Shop</Typography>
          <Typography variant={"body"}>
            Available Funds: <strong>{`$${user.cash}`}</strong>
          </Typography>
          <List>
            {items.map((item) => (
              <ListItem disablePadding key={item.id}>
                <ListItemButton
                  onClick={() =>
                    setSelection(item.price <= user.cash ? item : null)
                  }
                >
                  <ListItemAvatar>
                    <Avatar>
                      <ImageIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={item.name}
                    secondary={
                      `$${item.price}` +
                      (item.price > user.cash ? " (insufficient funds)" : "")
                    }
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Stack>
      )}
      {selection && (
        <Dialog
          open={selection}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">Confirm purchase</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {`Buy ${selection.name}?`}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <LoadingButton
              loading={mutation.isLoading}
              onClick={() => mutation.mutate(selection.id)}
            >
              Purchase
            </LoadingButton>
            <Button
              disabled={mutation.isLoading}
              onClick={() => setSelection(null)}
              autoFocus
            >
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
}
