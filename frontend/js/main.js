const recipesContainer = document.getElementById('recipes-container');
const recipeModal = document.getElementById('recipe-modal');
const modalClose = document.getElementById('modal-close');
let recipes = [];

async function importRecipes() {
    try {
        const response = await fetch('../backend/pizzas.json');

        if (!response.ok) {
            throw new Error(`Erro ao carregar receitas: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error(error);
        recipesContainer.textContent = 'Não foi possível carregar as receitas.';
        return [];
    }
}

async function loadRecipes() {
    recipes = await importRecipes();
    recipesContainer.innerHTML = recipes
        .map((recipe, index) => `<article class="card" data-recipe-index="${index}">
            <img src="${recipe.imagem}" alt="${recipe.nome}" class="card-image">
            <div class="card-info">
                <h3>${recipe.nome}</h3>
                <p>${recipe.descricao}</p>
            </div>
        </article>`)
        .join('');
}

function openModal(recipe) {
    document.getElementById('modal-image').src = recipe.imagem;
    document.getElementById('modal-image').alt = recipe.nome;
    document.getElementById('modal-title').textContent = recipe.nome;
    document.getElementById('modal-description').textContent = recipe.descricao;
    document.getElementById('modal-time').textContent = `${recipe.receita.tempoPreparoMinutos} minutos`;
    document.getElementById('modal-difficulty').textContent = recipe.receita.dificuldade;
    document.getElementById('modal-yield').textContent = recipe.receita.rendimento;

    document.getElementById('modal-ingredients').innerHTML = recipe.receita.ingredientes
        .map(ingredient => `<li>${ingredient.quantidade} ${ingredient.unidade} de ${ingredient.nome}</li>`)
        .join('');

    document.getElementById('modal-preparation').innerHTML = recipe.receita.modoDePreparo
        .map(step => `<li><strong>${step.titulo}:</strong> ${step.instrucao}</li>`)
        .join('');

    recipeModal.classList.add('is-open');
    recipeModal.setAttribute('aria-hidden', 'false');
    modalClose.focus();
}

function closeModal() {
    recipeModal.classList.remove('is-open');
    recipeModal.setAttribute('aria-hidden', 'true');
}

recipesContainer.addEventListener('click', event => {
    const button = event.target.closest('[data-recipe-index]');

    if (button) {
        openModal(recipes[button.dataset.recipeIndex]);
    }
});

modalClose.addEventListener('click', closeModal);

recipeModal.addEventListener('click', event => {
    if (event.target === recipeModal) {
        closeModal();
    }
});

document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && recipeModal.classList.contains('is-open')) {
        closeModal();
    }
});

loadRecipes();