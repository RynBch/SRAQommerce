const mongoose = require('mongoose');

// Schema pour les utilisateurs
const deliverySchema = new mongoose.Schema({
    
    // L'identifiant du client
    orderId: {
        type: String,
        required: true
    },

    // L'identifiant du vendeur
    sellerID: {
        type: String,
        required: true,
    },
    
    status: {
        type: boolean,
        default:true
    },

    // liste de produit
    productArray: {
        type: Array,
        required: true,
    }
    


}, { timestamps: true });

const Delivery = mongoose.model('Delivery', deliverySchema);

module.exports = Delivery;