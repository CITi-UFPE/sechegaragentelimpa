const mongoose = require('mongoose');

const { Schema } = mongoose;

const SubSchema = {
  type: String,
};

const usuarioSchema = new Schema({
  matricula: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
  },
  senha: {
    type: String,
    required: true,
  },
  empresa: {
    type: String,
    required: true,
  },
  tipo: {
    type: Number,
    required: true,
  },
  atividadesDoDia: [SubSchema],
},
{
  timestamps: true,
});

module.exports = mongoose.model('Usuario', usuarioSchema);
