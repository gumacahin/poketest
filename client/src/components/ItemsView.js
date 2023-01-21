import { useContext } from "react";
import { useQuery } from "react-query";
import axios from "axios";
import {
  Alert,
  AlertTitle,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Typography,
  Stack,
} from "@mui/material";

import ImageIcon from "@mui/icons-material/Image";
import { AuthContext } from "../context/AuthContext";
export default function ItemsView() {
  const { user } = useContext(AuthContext);
  const query = useQuery({
    queryKey: ["items"],
    queryFn: async () => {
      const res = await axios.get("http://localhost:8080/items", {
        headers: { Authorization: user.username },
      });
      return res.data;
    },
  });

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
          <Typography variant={"h2"}>Items</Typography>
          <List>
            {items.map((item) => (
              <ListItem key={item.id}>
                <ListItemAvatar>
                  <Avatar>
                    <ImageIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={item.name} />
              </ListItem>
            ))}
          </List>
        </Stack>
      )}
    </>
  );
}
