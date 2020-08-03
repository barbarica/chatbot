const chat = {
    1: {
        text: 'Hi! This is a choice-driven chatbot. Click "Start"',
        options: [
            {
                text: 'Start ⚡⚡',
                next: 2
            }
        ]
    },
    2: {
        text: 'This is <b>MGR-DST NewGen IEDC</b> protoype chatbot', //prototype <del>less than</del>',
        next: 3
    },
    3: {
        text: 'But you probably knew that anyway.',
        options: [
            {
                text: "Yes, I did!",
                next: 4
            },
            {
                text: "Nope, this is news.",
                next: 5
            }
        ]
    },
    4: {
        text: 'Awesome. This bot is still in development.',
        next: 7
    },
    5: {
        text: 'Aah, you\'re missing out!',
        next: 6
    },
    6: {
        text: 'Check out our another bot?',
        options: [
            {
                text: "Sure 👍",
                next: 7,
                //url: "#"
            }
        ]
    },
    7: {
        text: 'See you soon!'
    }
};


const bot = function () {

    const peekobot = document.getElementById('peekobot');
    const container = document.getElementById('peekobot-container');
    const inner = document.getElementById('peekobot-inner');
    let restartButton = null;

    const sleep = function (ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    };

    const scrollContainer = function () {
        inner.scrollTop = inner.scrollHeight;
    };

    const insertNewChatItem = function (elem) {
        //container.insertBefore(elem, peekobot);
        peekobot.appendChild(elem);
        scrollContainer();
        //debugger;
        elem.classList.add('activated');
    };

    const printResponse = async function (step) {
        const response = document.createElement('div');
        response.classList.add('chat-response');
        response.innerHTML = step.text;
        insertNewChatItem(response);

        await sleep(1500);

        if (step.options) {
            const choices = document.createElement('div');
            choices.classList.add('choices');
            step.options.forEach(function (option) {
                const button = document.createElement(option.url ? 'a' : 'button');
                button.classList.add('choice');
                button.innerHTML = option.text;
                if (option.url) {
                    button.href = option.url;
                } else {
                    button.dataset.next = option.next;
                }
                choices.appendChild(button);
            });
            insertNewChatItem(choices);
        } else if (step.next) {
            printResponse(chat[step.next]);
        }
    };

    const printChoice = function (choice) {
        const choiceElem = document.createElement('div');
        choiceElem.classList.add('chat-ask');
        choiceElem.innerHTML = choice.innerHTML;
        insertNewChatItem(choiceElem);
    };

    const disableAllChoices = function () {
        const choices = document.querySelectorAll('.choice');
        choices.forEach(function (choice) {
            choice.disabled = 'disabled';
        });
        return;
    };

    const handleChoice = async function (e) {

        if (!e.target.classList.contains('choice') || 'A' === e.target.tagName) {
            // Target isn't a button, but could be a child of a button.
            var button = e.target.closest('#peekobot-container .choice');

            if (button !== null) {
                button.click();
            }

            return;
        }

        e.preventDefault();
        const choice = e.target;

        disableAllChoices();

        printChoice(choice);
        scrollContainer();

        await sleep(1500);

        if (choice.dataset.next) {
            printResponse(chat[choice.dataset.next]);
        }
        // Need to disable buttons here to prevent multiple choices
    };

    const handleRestart = function () {
        startConversation();
    }

    const startConversation = function () {
        printResponse(chat[1]);
    }

    const init = function () {
        container.addEventListener('click', handleChoice);

        restartButton = document.createElement('button');
        restartButton.innerText = "Restart";
        restartButton.classList.add('restart');
        restartButton.addEventListener('click', handleRestart);

        closeButton = document.createElement('button');
        closeButton.innerText = "Close";
        closeButton.classList.add('close');
        closeButton.addEventListener('click', ()=>{
            document.getElementById('peekobot-fixed').style.display = 'none';
        });

        container.appendChild(restartButton);
        container.appendChild(closeButton);

        startConversation();
    };

    init();
}

bot();