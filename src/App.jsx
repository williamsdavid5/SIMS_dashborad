import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import GestaoEPI from "./pages/GestaoEPI";
import Historico from "./pages/GestaoEPI/Historico";
import Inventario from "./pages/GestaoEPI/Inventario";
import Estoque from "./pages/GestaoEPI/Estoque";
import Distribuicao from "./pages/GestaoEPI/Distribuicao";
import Monitoramento from "./pages/Monitoramento";
import EmissaoRelatorios from "./pages/EmissaoRelatorios";
import AnalisesGraficas from "./pages/AnalisesGraficas";
import Conformidade from "./pages/AnalisesGraficas/Conformidade";
import EPIs from "./pages/AnalisesGraficas/EPIs";
import Areas from "./pages/AnalisesGraficas/Areas";

import './App.css'

function App() {
  return (
    <Routes>
      <Route path="/home" element={<Home />} />
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="gestaoEPI" element={<GestaoEPI />}>
        <Route index element={<Inventario />} />
        <Route path="distribuicao" element={<Distribuicao />} />
        <Route path="historico" element={<Historico />} />
        <Route path="estoque" element={<Estoque />} />
      </Route>
      <Route path="monitoramento" element={<Monitoramento />} />
      <Route path="emissao-relatorios" element={<EmissaoRelatorios />} />
      <Route path="analises-graficas" element={<AnalisesGraficas />}>
        <Route index element={<Conformidade />} />
        <Route path="epis" element={<EPIs />} />
        <Route path="areas" element={<Areas />} />
      </Route>
    </Routes>
  );
}

export default App;