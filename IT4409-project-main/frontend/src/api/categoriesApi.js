import axios from "axios";
import { buildApiUrl } from "../config/api";

export const getCategories = async () => {
  const res = await axios.get(buildApiUrl("/categories"));
  return res.data || [];
};
