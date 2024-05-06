import React, { useState } from 'react';
import { get } from 'lodash';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';

import { toast } from 'react-toastify';
import { Container } from '../../styles/GlobalStyles';
import Loading from '../../components/Loading';
import { Title, Form } from './styled';
import axios from '../../services/axios';
import history from '../../services/history';
import * as actions from '../../store/modules/auth/actions';

export default function Fotos({ match }) {
    const dispatch = useDispatch();
    const id = get(match, 'params.id', '');
    const [isLoading, setIsLoading] = useState(false);
    const [foto, setFoto] = useState('');

    React.useEffect(() => {
        const getData = async () => {
            setIsLoading(true);
            try {
                const { data } = await axios.get(`/alunos/${id}`);
                setFoto(get(data, 'Fotos[0].url', ''));
                setIsLoading(false);
            } catch (err) {
                toast.error('Erro ao obter imagem');
                history.push('/');
            }
        };

        getData();
    }, [id]);

    const handleChange = async (e) => {
        const newFoto = e.target.files[0];
        const fotoURL = URL.createObjectURL(newFoto);

        setFoto(fotoURL);

        const formData = new FormData();
        formData.append('aluno_id', id);
        formData.append('foto', newFoto);

        try {
            setIsLoading(true);
            await axios.post('/fotos/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            toast.success('Foto enviada com sucesso');

            setIsLoading(false);
        } catch (err) {
            setIsLoading(false);
            const { status } = get(err, 'response', '');
            toast.error('Erro ao enviar foto.');

            if (status === 401) dispatch(actions.loginFailure());
        }
    };

    return (
        <Container>
            <Loading isLoading={isLoading} />

            <Title>Fotos</Title>

            <Form>
                <label htmlFor="foto">
                    {foto ? (
                        <img src={foto} alt="Foto" crossOrigin="" />
                    ) : (
                        'Selecionar'
                    )}
                    <input type="file" id="foto" onChange={handleChange} />
                </label>
            </Form>
        </Container>
    );
}

Fotos.propTypes = {
    match: PropTypes.shape({}).isRequired,
};