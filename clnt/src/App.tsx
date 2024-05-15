import { Sender } from "./../components/Sender";
import { Receiver } from "./../components/Receiver";
import { Route, Routes, BrowserRouter } from "react-router-dom";
function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/sender" element={<Sender />} />
          <Route path="/receiver" element={<Receiver />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
