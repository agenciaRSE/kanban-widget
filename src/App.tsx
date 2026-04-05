import { TitleBar } from "./components/TitleBar";
import { Board } from "./components/Board";

export default function App() {
  return (
    <div className="app-shell">
      <TitleBar />
      <Board />
    </div>
  );
}
