import { Routes, Route } from "react-router-dom";
import BaseLayout from "./layouts/BaseLayout";
import CreateDocumentPage from "./pages/CreateDocumentPage";
import ListDocumentPage from "./pages/ListDocumentPage";
import DetailDocumentPage from "./pages/DetailDocumentPage";

function App() {
  return (
    <Routes>
      <Route element={ <BaseLayout /> }>
        <Route path="/" element={ <ListDocumentPage /> } />
        <Route path="/add-warehouse-docs" element={ <CreateDocumentPage /> } />
        <Route path="/view-warehouse-docs/:id" element={ <DetailDocumentPage /> } />
      </Route>
    </Routes>
  )
}
export default App;