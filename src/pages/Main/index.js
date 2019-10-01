import React, { Component } from 'react';

import { FaGithubAlt, FaPlus, FaSpinner } from 'react-icons/fa';

import { Link } from 'react-router-dom';

import api from '../../services/api';

import Container from '../../components/Container';

import { Form, SubmitButton, List } from './styles';

export default class Main extends Component {
	constructor(props) {
		super(props);
		this.state = {
			newRepo: '',
			repositories: [],
			loadingx: false,
		};
	}

	// Carregar os dados do localStorage
	componentWillMount() {
		const repositories = localStorage.getItem('repositories');

		if (repositories) {
			this.setState({ repositories: JSON.parse(repositories) });
		}
	}

	// Salvar os dados do localStorage
	componentDidUpdate(_, prevState) {
		const { repositories } = this.state;

		if (prevState.repositories !== repositories) {
			localStorage.setItem('repositories', JSON.stringify(repositories));
		}
	}

	handleInputChange = event => {
		this.setState({ newRepo: event.target.value });
	};

	handleSubmit = async event => {
		event.preventDefault();

		this.setState({ loadingx: true });

		const { newRepo, repositories } = this.state;

		const response = await api.get(`/repos/${newRepo}`);

		const data = {
			name: response.data.full_name,
		};

		this.setState({
			repositories: [...repositories, data],
			newRepo: '',
			loadingx: false,
		});
	};

	render() {
		const { newRepo, repositories, loadingx } = this.state;
		return (
			<Container>
				<h1>
					<FaGithubAlt />
					Repositorios
				</h1>
				<Form onSubmit={this.handleSubmit}>
					<input
						type="text"
						placeholder="Adicionar novo repositorio"
						value={newRepo}
						onChange={this.handleInputChange}
					/>
					<SubmitButton loadingx={loadingx}>
						{loadingx ? (
							<FaSpinner color="#fff" size={14} />
						) : (
							<FaPlus color="#fff" size={14} />
						)}
					</SubmitButton>
				</Form>
				<List>
					{repositories.map(repository => (
						<li key={repository.name}>
							<span>{repository.name}</span>
							<Link
								to={`/repository/${encodeURIComponent(
									repository.name
								)}`}
							>
								Detalhes
							</Link>
						</li>
					))}
				</List>
			</Container>
		);
	}
}
