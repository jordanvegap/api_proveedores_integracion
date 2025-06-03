const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken.middleware")
//[Controllers API]
const tokenController = require("../controllers/token.controller");
const ticketsController = require("../controllers/tickets.controller");

const equiposController = require("../controllers/equipos.controller");

let routes = (app) => {
  router.post("/createToken", tokenController.createTokenProvider);
  router.get("/getNewTicketsProvider/:idProvider", [verifyToken.verifyTokenProvider], ticketsController.getNewTicketsProvider);
  router.get("/getTicketsProviderById/:idProvider/:newIdTicket", [verifyToken.verifyTokenProvider], ticketsController.getTicketsProviderById);
  router.put("/updateTicketProvider/:idProvider/:newIdTicket", [verifyToken.verifyTokenProvider], ticketsController.updateTicketProvider);
  router.post("/insertBitacoraTicket/:idProvider/:idTicket", [verifyToken.verifyTokenProvider], ticketsController.insertBitacoraTicket);
  router.post("/insertBitacoraTicketByNewId/:idProvider/:newIdTicket", [verifyToken.verifyTokenProvider], ticketsController.insertBitacoraTicketByNewId);
  router.get("/generateNewID/:idProvider", [verifyToken.verifyTokenProvider], ticketsController.generateNewID);
  router.post("/insertTicketProvider/:idProvider/:idEmpleadoProvider", [verifyToken.verifyTokenProvider], ticketsController.insertTicketProvider);
  router.put("/updateEstatusTicket/:idProvider", [verifyToken.verifyTokenProvider], ticketsController.updateEstatusTicket);
  router.put("/CancelarTicket/:idProvider", [verifyToken.verifyTokenProvider], ticketsController.CancelarTicket);
  router.post("/insertTicketProviderSSI/:idProvider/:idEmpleadoProvider", [verifyToken.verifyTokenProvider], ticketsController.insertTicketProviderSSI);
  router.get("/getTicketFoto/:idProvider/:newIdTicket", [verifyToken.verifyTokenProvider], ticketsController.get_Ticket_Foto);
  router.get("/getTicketDocumentos/:idProvider/:newIdTicket", [verifyToken.verifyTokenProvider], ticketsController.get_Ticket_Documentos);
  router.post("/pauseTicket/:idProvider", [verifyToken.verifyTokenProvider], ticketsController.pauseTicket);
  router.post("/resumeTicket/:idProvider", [verifyToken.verifyTokenProvider], ticketsController.resumeTicket);
  router.get("/getCatalogoCategorizaciones/:idProvider", [verifyToken.verifyTokenProvider], ticketsController.getCatalogoCategorizaciones);
  router.get("/getNewTicketsSiadeconsrv/:idProvider", [verifyToken.verifyTokenProvider], ticketsController.getNewTicketsSiadeconsrv);
  router.get("/getTicketsSiadeconsrvById/:idProvider/:newIdTicket", [verifyToken.verifyTokenProvider], ticketsController.getTicketsSiadeconsrvById);
  router.post("/insertMensajeTicketByNewId/:idProvider/:newIdTicket", [verifyToken.verifyTokenProvider], ticketsController.insertMensajeTicketByNewId);
  router.get("/getTicketsProviderCerrados/:idProvider", [verifyToken.verifyTokenProvider], ticketsController.getTicketsProviderCerrados);
  router.get("/getTicketsProviderEnproceso/:idProvider", [verifyToken.verifyTokenProvider], ticketsController.getTicketsProviderEnproceso);
  router.get("/getTicketsProviderReasignados/:idProvider", [verifyToken.verifyTokenProvider], ticketsController.getTicketsProviderReasignados);
  
  router.get("/getInventario/:idProvider", [verifyToken.verifyTokenProvider], equiposController.ReadEquipoProvider);
  router.post("/insertInventario/:idProvider/:idEmpleadoProvider/:codVPN", [verifyToken.verifyTokenProvider], equiposController.CreateEquipoProvider);
  router.put("/updateInventario/:idProvider/:idEmpleadoProvider/:noSerie", [verifyToken.verifyTokenProvider], equiposController.UpdateEquipoProvider);

  return app.use("/", router);
};

module.exports = routes;