import mongoose from "mongoose"

// Schema pour les utilisateurs
const orderSchema = new mongoose.Schema({
    
    // Identifiant du client
    clientId: {
        type: String,
        required: true
    },

    status: {
        type: String,
        default: "En attente d'envoie des produits"
    },

    // Liste de produit
    productArray: {
        type: Array,
        default: []
    }

}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);

export default Order