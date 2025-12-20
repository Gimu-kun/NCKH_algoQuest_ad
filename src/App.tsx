import RouteList from "./routes/RouteList"
import { MathJaxContext } from "better-react-mathjax";

const config = {
  tex: {
    inlineMath: [["$", "$"], ["\\(", "\\)"]],
    displayMath: [["$$", "$$"]],
  },
};

function App() {
  return (
    <RouteList/>
  )
}

export default App
