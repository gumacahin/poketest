import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import PokeViewer from "../components/PokeViewer";
import PokePicker from "../components/PokePicker";

export default function DashboardView() {
  const { user } = useContext(AuthContext);

  return user.pokemon_id ? (
    <PokeViewer user={user} />
  ) : (
    <PokePicker user={user} />
  );
}
