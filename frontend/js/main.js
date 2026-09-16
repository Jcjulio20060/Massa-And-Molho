const recipesContainer = document.getElementById('recipes-container');
const recipesStatus = document.getElementById('recipes-status');
const recipeModal = document.getElementById('recipe-modal');
const modalBody = document.getElementById('modal-body');
const modalContent = recipeModal.querySelector('.modal-content');
const modalClose = document.getElementById('modal-close');

const currency = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
});

let recipes = [];
let activeRecipe = null;
let lastFocusedElement = null;
let cookTimer = null;

function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, function (character) {
        return {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        }[character];
    });
}

function illustrationFor(token) {
    const library = window.ILLUSTRATIONS || {};
    const draw = library[token];
    return typeof draw === 'function' ? draw() : '';
}

function leaderRow(label, value, modifier) {
    return '<span class="leader">' +
        '<span class="leader-label">' + escapeHtml(label) + '</span>' +
        '<span class="leader-dots"></span>' +
        '<span class="leader-price' + (modifier ? ' ' + modifier : '') + '">' + value + '</span>' +
        '</span>';
}

async function importRecipes() {
    const response = await fetch('../backend/pizzas.json');

    if (!response.ok) {
        throw new Error('Resposta ' + response.status);
    }

    return response.json();
}

function renderRecipes() {
    recipesContainer.innerHTML = recipes.map(function (recipe, index) {
        const precos = recipe.cardapioPizzaria.precos;
        const leaders = precos.map(function (preco) {
            return leaderRow(preco.tamanho, currency.format(preco.preco));
        }).join('');

        return '<button class="card" type="button" data-index="' + index + '" ' +
            'aria-label="Abrir receita e cardápio de ' + escapeHtml(recipe.nome) + '">' +
            '<span class="card-art">' + illustrationFor(recipe.ilustracao) + '</span>' +
            '<span class="card-stamps">' +
                '<span class="stamp">' + escapeHtml(recipe.categoria) + '</span>' +
                '<span class="stamp stamp--basil">' + recipe.receita.tempoPreparoMinutos + ' min</span>' +
            '</span>' +
            '<span class="card-name">' + escapeHtml(recipe.nome) + '</span>' +
            '<span class="card-desc">' + escapeHtml(recipe.descricao) + '</span>' +
            '<span class="price-leaders">' + leaders + '</span>' +
            '<span class="card-cta">Ver receita e pedir →</span>' +
        '</button>';
    }).join('');
}

async function loadRecipes() {
    try {
        recipes = await importRecipes();
        recipesContainer.setAttribute('aria-busy', 'false');
        renderRecipes();
    } catch (error) {
        console.error(error);
        recipesContainer.setAttribute('aria-busy', 'false');
        recipesContainer.innerHTML = '';
        recipesStatus.textContent = 'Não conseguimos abrir o cardápio agora. Recarregue a página para tentar de novo.';
    }
}

function stopCookTimer() {
    if (cookTimer !== null) {
        window.clearInterval(cookTimer);
        cookTimer = null;
    }
}

function metaStamps(recipe) {
    return '<span class="stamp stamp--basil">' + recipe.receita.tempoPreparoMinutos + ' min de preparo</span>' +
        '<span class="stamp">' + escapeHtml(recipe.receita.dificuldade) + '</span>' +
        '<span class="stamp">' + escapeHtml(recipe.receita.rendimento) + '</span>' +
        '<span class="stamp">' + recipe.receita.caloriasAprox + ' kcal por fatia</span>';
}

function renderRecipeView() {
    stopCookTimer();

    const recipe = activeRecipe;
    const lista = recipe.cardapioPizzaria.precos.map(function (preco) {
        return leaderRow(preco.tamanho + ' · ' + preco.fatias + ' fatias', currency.format(preco.preco));
    }).join('');

    const bordas = recipe.cardapioPizzaria.opcoesBorda.map(function (borda) {
        const extra = borda.precoAdicional > 0 ? '+ ' + currency.format(borda.precoAdicional) : 'incluso';
        return '<li class="stamp">' + escapeHtml(borda.nome) + ' · ' + extra + '</li>';
    }).join('');

    const ingredientes = recipe.receita.ingredientes.map(function (item) {
        return '<li class="ingredient">' +
            '<span class="ingredient-name">' + escapeHtml(item.nome) + '</span>' +
            '<span class="ingredient-dots"></span>' +
            '<span class="ingredient-qty">' + escapeHtml(item.quantidade + ' ' + item.unidade) + '</span>' +
        '</li>';
    }).join('');

    const passos = recipe.receita.modoDePreparo.map(function (passo) {
        return '<li class="step">' +
            '<span class="step-body">' +
                '<span class="step-title">' + escapeHtml(passo.titulo) + '</span>' +
                '<span class="step-text">' + escapeHtml(passo.instrucao) + '</span>' +
            '</span>' +
        '</li>';
    }).join('');

    modalBody.innerHTML =
        '<div class="modal-art">' + illustrationFor(recipe.ilustracao) + '</div>' +
        '<p class="eyebrow">' + escapeHtml(recipe.categoria) + '</p>' +
        '<h2 class="modal-title" id="modal-title">' + escapeHtml(recipe.nome) + '</h2>' +
        '<p class="modal-desc">' + escapeHtml(recipe.descricao) + '</p>' +
        '<div class="modal-meta">' + metaStamps(recipe) + '</div>' +
        '<div class="modal-section"><h3>Ingredientes</h3><ul class="ingredients">' + ingredientes + '</ul></div>' +
        '<div class="modal-section"><h3>Modo de preparo</h3><ol class="steps">' + passos + '</ol></div>' +
        '<div class="modal-section"><h3>No cardápio</h3>' +
            '<div class="menu-prices">' + lista + '</div>' +
            '<ul class="borda-list">' + bordas + '</ul>' +
        '</div>' +
        '<div class="actions">' +
            '<button class="btn btn--cook" type="button" id="start-cook">Iniciar preparo</button>' +
            '<button class="btn btn--order" type="button" id="start-order">Pedir pizza</button>' +
        '</div>';

    document.getElementById('start-cook').addEventListener('click', openCookView);
    document.getElementById('start-order').addEventListener('click', openOrderView);
}

function formatClock(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return String(minutes).padStart(2, '0') + ':' + String(seconds).padStart(2, '0');
}

function cookStepsMarkup(currentStep) {
    return activeRecipe.receita.modoDePreparo.map(function (passo, index) {
        let state = '';

        if (index < currentStep) {
            state = ' is-done';
        } else if (index === currentStep) {
            state = ' is-current';
        }

        return '<li class="cook-step' + state + '">' +
            '<span class="cook-step-title">' + escapeHtml(passo.titulo) + '</span>' +
            '<span class="cook-step-text">' + escapeHtml(passo.instrucao) + '</span>' +
        '</li>';
    }).join('');
}

function openCookView() {
    stopCookTimer();

    const total = activeRecipe.receita.tempoPreparoMinutos * 60;
    const state = {
        total: total,
        remaining: total,
        step: 0,
        running: true
    };

    modalBody.innerHTML =
        '<div class="cook">' +
            '<p class="eyebrow cook-eyebrow">Mão na massa</p>' +
            '<h2 class="modal-title" id="modal-title">Preparando ' + escapeHtml(activeRecipe.nome) + '</h2>' +
            '<p class="cook-clock" id="cook-clock" aria-hidden="true">' + formatClock(total) + '</p>' +
            '<p class="cook-clock-label">tempo de preparo estimado</p>' +
            '<div class="timer-track"><div class="timer-fill" id="timer-fill"></div></div>' +
            '<p class="visually-hidden" role="status" id="cook-announce">Preparo iniciado.</p>' +
            '<ol class="cook-steps" id="cook-steps">' + cookStepsMarkup(0) + '</ol>' +
            '<div class="cook-actions">' +
                '<button class="btn btn--ghost" type="button" id="cook-back">Voltar à receita</button>' +
                '<button class="btn btn--ghost" type="button" id="cook-toggle">Pausar</button>' +
                '<button class="btn btn--cook" type="button" id="cook-next">Próximo passo</button>' +
            '</div>' +
        '</div>';

    const clock = document.getElementById('cook-clock');
    const fill = document.getElementById('timer-fill');
    const toggle = document.getElementById('cook-toggle');
    const announce = document.getElementById('cook-announce');
    const stepsList = document.getElementById('cook-steps');

    function paint() {
        clock.textContent = formatClock(state.remaining);
        fill.style.width = (state.remaining / state.total * 100) + '%';
    }

    function finish() {
        stopCookTimer();
        state.running = false;
        clock.classList.add('is-done');
        fill.classList.add('is-done');
        clock.textContent = 'Pronto!';
        toggle.disabled = true;
        toggle.textContent = 'Concluído';
        announce.textContent = 'Tempo de preparo concluído. Bom apetite.';
    }

    cookTimer = window.setInterval(function () {
        if (!state.running) {
            return;
        }

        state.remaining -= 1;
        paint();

        if (state.remaining <= 0) {
            state.remaining = 0;
            finish();
        }
    }, 1000);

    toggle.addEventListener('click', function () {
        state.running = !state.running;
        toggle.textContent = state.running ? 'Pausar' : 'Retomar';
        announce.textContent = state.running ? 'Preparo retomado.' : 'Preparo pausado.';
    });

    document.getElementById('cook-next').addEventListener('click', function () {
        const totalSteps = activeRecipe.receita.modoDePreparo.length;

        if (state.step < totalSteps - 1) {
            state.step += 1;
            stepsList.innerHTML = cookStepsMarkup(state.step);
            announce.textContent = 'Passo ' + (state.step + 1) + ' de ' + totalSteps + '.';
            stepsList.querySelector('.is-current').scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        }
    });

    document.getElementById('cook-back').addEventListener('click', renderRecipeView);

    paint();
}

function orderChoices(items, name, describe, includeAdicional) {
    return items.map(function (item, index) {
        const price = includeAdicional ? item.precoAdicional : item.preco;
        const priceLabel = includeAdicional && item.precoAdicional === 0
            ? 'incluso'
            : currency.format(price);

        return '<label class="choice">' +
            '<input type="radio" name="' + name + '" value="' + index + '" ' +
                'data-price="' + price + '" data-label="' + escapeHtml(item.nome || item.tamanho) + '" ' +
                (index === 0 ? 'checked' : '') + '>' +
            '<span class="choice-choice-mark" aria-hidden="true"></span>' +
            '<span class="choice-center">' +
                '<span class="choice-name">' + escapeHtml(item.nome || item.tamanho) + '</span>' +
                (describe ? '<span class="choice-sub">' + escapeHtml(describe(item)) + '</span>' : '') +
            '</span>' +
            '<span class="leader-dots"></span>' +
            '<span class="leader-price">' + priceLabel + '</span>' +
        '</label>';
    }).join('');
}

function openOrderView() {
    stopCookTimer();

    const cardapio = activeRecipe.cardapioPizzaria;

    modalBody.innerHTML =
        '<div class="order">' +
            '<p class="eyebrow">Pedido</p>' +
            '<h2 class="modal-title" id="modal-title">' + escapeHtml(activeRecipe.nome) + '</h2>' +
            '<p class="modal-desc">Escolha o tamanho e a borda. A cozinha confirma tudo antes de assar.</p>' +
            '<form id="order-form" novalidate>' +
                '<fieldset><legend>Tamanho</legend>' +
                    orderChoices(cardapio.precos, 'size', function (item) {
                        return item.fatias + ' fatias';
                    }, false) +
                '</fieldset>' +
                '<fieldset><legend>Borda</legend>' +
                    orderChoices(cardapio.opcoesBorda, 'borda', null, true) +
                '</fieldset>' +
                '<div class="order-summary">' +
                    '<span class="summary-row"><span class="leader-label">Tamanho</span><span class="leader-dots"></span><span class="leader-price" id="sum-size"></span></span>' +
                    '<span class="summary-row"><span class="leader-label">Borda</span><span class="leader-dots"></span><span class="leader-price" id="sum-borda"></span></span>' +
                '</div>' +
                '<div class="summary-total"><span class="summary-total-label">Total</span><span class="summary-total-value" id="sum-total"></span></div>' +
                '<p class="order-note">Previsão de entrega: 40 a 50 minutos. O pagamento é combinado na confirmação.</p>' +
                '<div class="actions">' +
                    '<button class="btn btn--ghost" type="button" id="order-back">Voltar à receita</button>' +
                    '<button class="btn btn--order" type="submit">Confirmar pedido</button>' +
                '</div>' +
            '</form>' +
        '</div>';

    const form = document.getElementById('order-form');

    function selected(name) {
        return form.querySelector('input[name="' + name + '"]:checked');
    }

    function updateSummary() {
        const size = selected('size');
        const borda = selected('borda');
        const total = Number(size.dataset.price) + Number(borda.dataset.price);

        document.getElementById('sum-size').textContent = size.dataset.label + ' · ' + currency.format(Number(size.dataset.price));
        document.getElementById('sum-borda').textContent = borda.dataset.label + ' · ' +
            (Number(borda.dataset.price) === 0 ? 'incluso' : currency.format(Number(borda.dataset.price)));
        document.getElementById('sum-total').textContent = currency.format(total);
    }

    form.addEventListener('change', updateSummary);
    form.addEventListener('submit', function (event) {
        event.preventDefault();
        renderConfirmationView({
            size: selected('size').dataset.label,
            borda: selected('borda').dataset.label,
            total: Number(selected('size').dataset.price) + Number(selected('borda').dataset.price)
        });
    });

    document.getElementById('order-back').addEventListener('click', renderRecipeView);

    updateSummary();
}

function renderConfirmationView(order) {
    stopCookTimer();

    const code = 'MM-' + Date.now().toString(36).slice(-4).toUpperCase();

    modalBody.innerHTML =
        '<div class="confirmation">' +
            '<svg class="confirmation-mark" viewBox="0 0 48 48" width="64" height="64" aria-hidden="true">' +
                '<circle cx="24" cy="24" r="21" fill="none" stroke="currentColor" stroke-width="3" stroke-dasharray="4 5"/>' +
                '<path d="M14 25 l7 7 l14 -16" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>' +
            '</svg>' +
            '<h2 class="modal-title" id="modal-title">Pedido na cozinha!</h2>' +
            '<p class="confirmation-text">' + escapeHtml(activeRecipe.nome) + ', ' + escapeHtml(order.size) +
                ' com ' + escapeHtml(order.borda.toLowerCase()) + '. Total de ' + currency.format(order.total) +
                '. Chega em 40 a 50 minutos.</p>' +
            '<p class="confirmation-code">Pedido ' + code + '</p>' +
            '<div class="actions">' +
                '<button class="btn btn--ghost" type="button" id="conf-recipe">Ver a receita</button>' +
                '<button class="btn btn--order" type="button" id="conf-close">Voltar ao cardápio</button>' +
            '</div>' +
        '</div>';

    document.getElementById('conf-recipe').addEventListener('click', renderRecipeView);
    document.getElementById('conf-close').addEventListener('click', closeModal);
}

function focusableElements() {
    return Array.from(modalContent.querySelectorAll(
        'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )).filter(function (element) {
        return element.offsetParent !== null;
    });
}

function trapFocus(event) {
    if (event.key !== 'Tab') {
        return;
    }

    const focusable = focusableElements();

    if (focusable.length === 0) {
        return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const current = focusable.indexOf(document.activeElement);

    if (current === -1) {
        event.preventDefault();
        (event.shiftKey ? last : first).focus();
        return;
    }

    if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
    }
}

function onKeydown(event) {
    if (!recipeModal.classList.contains('is-open')) {
        return;
    }

    if (event.key === 'Escape') {
        event.preventDefault();
        closeModal();
        return;
    }

    trapFocus(event);
}

function openModal(index, opener) {
    activeRecipe = recipes[index];

    if (!activeRecipe) {
        return;
    }

    lastFocusedElement = opener || document.activeElement;
    renderRecipeView();

    recipeModal.classList.add('is-open');
    recipeModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    modalContent.focus();

    document.addEventListener('keydown', onKeydown);
}

function closeModal() {
    stopCookTimer();
    recipeModal.classList.remove('is-open');
    recipeModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    document.removeEventListener('keydown', onKeydown);
    modalBody.innerHTML = '';

    if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
        lastFocusedElement.focus();
    }
}

recipesContainer.addEventListener('click', function (event) {
    const card = event.target.closest('.card');

    if (card) {
        openModal(Number(card.dataset.index), card);
    }
});

modalClose.addEventListener('click', closeModal);

recipeModal.addEventListener('click', function (event) {
    if (event.target === recipeModal) {
        closeModal();
    }
});

loadRecipes();