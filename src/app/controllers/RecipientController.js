import axios from 'axios';
import * as yup from 'yup';
import Recipient from '../models/Recipient';

class RecipientController {
  async store(req, res) {
    const schema = yup.object().shape({
      name: yup.string().required(),
      number: yup
        .string()
        .required()
        .matches(/[0-9]+/),
      address_complement: yup.string().matches(/[A-Za-z]*/),
      zip_code: yup
        .string()
        .required()
        .matches(/[0-9]{8}/)
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'validation fails' });
    }

    const { name, number, zip_code } = req.body;
    let { address_complement } = req.body;

    const apiResponse = await axios.get(
      `http://ws.matheuscastiglioni.com.br/ws/cep/find/${zip_code}/json`
    );

    const address = apiResponse.data.logradouro;

    if (address_complement == '')
      address_complement = apiResponse.data.complemento;

    const state = apiResponse.data.estado;
    const city = apiResponse.data.cidade;

    const recipientExists = await Recipient.findOne({
      where: { name, address, number, city }
    });

    if (recipientExists) {
      return res.status(400).json({ error: 'Recipient already exists' });
    }

    if (!recipientExists) {
      const recipient = await Recipient.create({
        name,
        address,
        number,
        address_complement,
        state,
        city,
        zip_code
      });
      return res.json(recipient);
    }
  }

  async update(req, res) {
    const schema = yup.object().shape({
      name: yup.string(),
      number: yup.string().matches(/[0-9]+/),
      address_complement: yup.string().matches(/[A-Za-z]*/),
      zip_code: yup.string().matches(/[0-9]{8}/)
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'validation fails' });
    }

    const { id } = req.params;

    const { name, number, address_complement, zip_code } = req.body;
    const apiResponse = await axios.get(
      `http://ws.matheuscastiglioni.com.br/ws/cep/find/${zip_code}/json`
    );

    const city = apiResponse.data.cidade;
    const state = apiResponse.data.estado;
    const address = apiResponse.data.logradouro;

    const recipient = await Recipient.findByPk(id);

    await recipient.update({
      name,
      address,
      number,
      address_complement,
      state,
      city,
      zip_code
    });

    return res.status(200).json({
      name,
      address,
      number,
      address_complement,
      state,
      city,
      zip_code
    });
  }
}

export default new RecipientController();
