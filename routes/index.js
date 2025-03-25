import { format } from "date-fns";

const date = document.getElementById("date");

const d = format(new Date(2014, 1, 11), "yyyy-MM-dd");

date.innerHTML = d;
