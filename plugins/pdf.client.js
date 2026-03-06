import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default (_, inject) => {
  inject("jsPDF", jsPDF);
  inject("html2canvas", html2canvas);
};
