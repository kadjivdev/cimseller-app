// BASE URL

const apiRoutes = {

  // auth routes
  login: `auth/login`,
  logout: `auth/logout`,
  refresh: `auth/refresh`,
  // verifyToken: `verify-token`,

  // user's routes
  allUser: `users`,
  createUser: `users`,
  importUser: `users`,
  updateUser: (id) => (`users/${id}`),
  deleteUser: (id) => (`users/${id}`),

  // role's routes
  allRole: `roles`,
  retrieveRole: (id) => (`roles/${id}`),
  createRole: `roles`,
  updateRole: (id) => (`roles/${id}`),
  deleteRole: (id) => (`roles/${id}`),

  // permission's routes
  allPermission: `permissions`,
  createPermission: `permissions`,
  updatePermission: (id) => (`permissions/${id}`),
  deletePermission: (id) => (`permissions/${id}`),

  // commande's routes
  allCommande: `commandes`,
  allValidatedCommande: `commandes/validated`,
  createCommande: `commandes`,
  updateCommande: (id) => (`commandes/${id}`),
  retrieveCommande: (id) => (`commandes/${id}`),
  validateCommande: (id) => (`commandes/${id}`),
  deleteCommande: (id) => (`commandes/${id}`),
  allCommandeTypes: `commandes-types`,
  allCommandeStatus: `commandes-status`,

  
  // commande's routes
  allCommande: `commandes`,
  createCommande: `commandes`,
  updateCommande: (id) => (`commandes/${id}`),
  deleteCommande: (id) => (`commandes/${id}`),

  // commande recu's routes
  allCommandeRecu: `commande-recus`,
  createCommandeRecu: `commande-recus`,
  retrieveCommandeRecu: (id) => (`commande-recus/${id}`),
  updateCommandeRecu: (id) => (`commande-recus/${id}`),
  deleteCommandeRecu: (id) => (`commande-recus/${id}`),

  // commande recu versement's routes
  allCommandeRecuVersement: `commande-recu-versements`,
  createCommandeRecuVersement: `commande-recu-versements`,
  updateCommandeRecuVersement: (id) => (`commande-recu-versements/${id}`),
  deleteCommandeRecuVersement: (id) => (`commande-recu-versements/${id}`),

  // commande recu accuse's routes
  allCommandeRecuAccuse: `commande-recu-accuses`,
  createCommandeRecuAccuse: `commande-recu-accuses`,
  updateCommandeRecuAccuse: (id) => (`commande-recu-accuses/${id}`),
  deleteCommandeRecuAccuse: (id) => (`commande-recu-accuses/${id}`),
  allDocumentTypes: `documents/types`,
  allDetailRecuTypes: `commandes/detail-recus/types`,

  // programmation's routes
  allProgrammation: `programmations`,
  allValidatedProgrammation: `programmations/validate`,
  createProgrammation: `programmations`,
  printProgrammation: `programmations/print`,
  updateProgrammation: (id) => (`programmations/${id}`),
  validateProgrammation: (id) => (`programmations/${id}`),
  deleteProgrammation: (id) => (`programmations/${id}`),

  // vente's routes
  allVente: `ventes`,
  allValidatedVente: `ventes/validated`,
  createVente: `ventes`,
  updateVente: (id) => (`ventes/${id}`),
  validateVente: (id) => (`ventes/${id}`),
  deleteVente: (id) => (`ventes/${id}`),

  // approvisionnement's routes
  allApprovisionnement: `approvisionnements`,
  createApprovisionnement: `approvisionnements`,
  updateApprovisionnement: (id) => (`approvisionnements/${id}`),
  validateApprovisionnement: (id) => (`approvisionnements/${id}`),
  deleteApprovisionnement: (id) => (`approvisionnements/${id}`),

  // reglement's routes
  allReglement: `reglements`,
  createReglement: `reglements`,
  updateReglement: (id) => (`reglements/${id}`),
  validateReglement: (id) => (`reglements/${id}`),
  deleteReglement: (id) => (`reglements/${id}`),

  // vente comptabilitz's routes
  allComptabilities: `comptabilities`,
  createComptabilities: `comptabilities`,
  updateComptabilities: (id) => (`comptabilities/${id}`),
  validateComptabilities: (id) => (`comptabilities/${id}`),
  deleteComptabilities: (id) => (`comptabilities/${id}`),

  /**
   * Tools
   */

  // zone's routes
  allZone: `zones`,
  createZone: `zones`,
  updateZone: (id) => (`zones/${id}`),
  deleteZone: (id) => (`zones/${id}`),

  // representant's routes
  allRepresentant: `representants`,
  createRepresentant: `representants`,
  updateRepresentant: (id) => (`representants/${id}`),
  deleteRepresentant: (id) => (`representants/${id}`),

  // product's routes
  allProduit: `produits`,
  allTypeProduit: `produits/types`,
  createProduit: `produits`,
  updateProduit: (id) => (`produits/${id}`),
  deleteProduit: (id) => (`produits/${id}`),

  // banque's routes
  allBanque: `banques`,
  createBanque: `banques`,
  updateBanque: (id) => (`banques/${id}`),
  deleteBanque: (id) => (`banques/${id}`),

  // compte bancaire's routes
  allCompteBancaire: `compte-bancaires`,
  createCompteBancaire: `compte-bancaires`,
  updateCompteBancaire: (id) => (`compte-bancaires/${id}`),
  deleteCompteBancaire: (id) => (`compte-bancaires/${id}`),

  // agent's routes
  allAgent: `agents`,
  createAgent: `agents`,
  updateAgent: (id) => (`agents/${id}`),
  deleteAgent: (id) => (`agents/${id}`),

  // marque camion's routes
  allMarqueCamion: `marques`,
  createMarqueCamion: `marques`,
  updateMarqueCamion: (id) => (`marques/${id}`),
  deleteMarqueCamion: (id) => (`marques/${id}`),

  // camion's routes
  allCamion: `camions`,
  createCamion: `camions`,
  updateCamion: (id) => (`camions/${id}`),
  deleteCamion: (id) => (`camions/${id}`),

  // avaliseur's routes
  allAvaliseur: `avaliseurs`,
  createAvaliseur: `avaliseurs`,
  updateAvaliseur: (id) => (`avaliseurs/${id}`),
  deleteAvaliseur: (id) => (`avaliseurs/${id}`),

  // chauffeur's routes
  allChauffeur: `chauffeurs`,
  createChauffeur: `chauffeurs`,
  updateChauffeur: (id) => (`chauffeurs/${id}`),
  deleteChauffeur: (id) => (`chauffeurs/${id}`),

  // fournisseur's routes
  allFournisseur: `fournisseurs`,
  createFournisseur: `fournisseurs`,
  updateFournisseur: (id) => (`fournisseurs/${id}`),
  deleteFournisseur: (id) => (`fournisseurs/${id}`),

  // fournisseur's routes
  allFournisseur: `fournisseurs`,
  createFournisseur: `fournisseurs`,
  updateFournisseur: (id) => (`fournisseurs/${id}`),
  deleteFournisseur: (id) => (`fournisseurs/${id}`),

  /**
   * client's routes
   *  
   */

  allClient: `clients`,
  allActifClient: `client-filters/actifs`,
  allInactifClient: `client-filters/inactifs`,
  allBefClient: `client-filters/befs`,
  createClient: `clients`,
  importClient: `clients`,
  updateClient: (id) => (`clients/${id}`),
  deleteClient: (id) => (`clients/${id}`),
  allClientStatus: `clients/status`,

  // client's routes
}

export default apiRoutes