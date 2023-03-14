/* fetch data and display it depending on local storage content */
async function commentsData() {
    const response = await fetch("data.json");
    const data = await response.json();

    if (window.localStorage.getItem(`data`) === null) {
        window.localStorage.setItem(`data`, JSON.stringify(data));
        const getData = window.localStorage.getItem(`data`);
        const storageData = JSON.parse(getData);
        displayComments(storageData);
    } else {
        const getData = window.localStorage.getItem(`data`);
        const storageData = JSON.parse(getData);
        displayComments(storageData);
    }
}

/* start of all */
function displayComments(e) {
    const main = document.querySelector(`main`);
    const currentUser = e.currentUser;
    let comments = e.comments;


    /* update content functions */
    function updateStorageData() {
        localStorage.setItem(`data`, JSON.stringify(e));
    }

    function updateNodes() {
        const userEditableArea = document.querySelectorAll(`[contenteditable="true"]`);
        const replyButton = document.querySelectorAll(`.replyWrapper`);
        replyButton.forEach(button => button.addEventListener(`click`, handleReplyButton));

        /* Prevent from paste HTML elements */

        userEditableArea.forEach( area => area.addEventListener(`paste`, function(e) {
            e.preventDefault();
            const text = e.clipboardData.getData(`text/plain`);
            const range = document.getSelection().getRangeAt(0);
            range.deleteContents();

            const textNode = document.createTextNode(text);
            range.insertNode(textNode);
            range.selectNodeContents(textNode);
            range.collapse(false);

        }))
    }

    /* dropdown */

    function handleDropdownNavigation() {
        const dropdownContent = document.querySelector(`.dropdownContent`);
        const arrow = document.querySelector(`.arrow`);
        arrow.classList.toggle(`arrowAfter`);
        dropdownContent.classList.toggle(`hidden`);
    }


    /* change user option */

    function handleChangeUser(e) {
        console.log(e.currentTarget);
        currentUser.username = e.currentTarget.textContent;
        currentUser.image.webp = e.currentTarget.firstChild.getAttribute(`src`);
        console.log(currentUser);
        updateStorageData();
        window.location.reload();
    }

    /* logged as */

    const loggedAs = document.querySelector(`.logged`);
    loggedAs.firstElementChild.setAttribute(`src`, currentUser.image.webp);
    loggedAs.lastElementChild.textContent = `${currentUser.username}`;

    /* display html based on data.json */

    let showHtml = comments.map(comment =>
        `<div class="commentWithReplies">`
            +
        `
        <div class="memberWrapper mainComment" data-id="${comment.id}">
            
            <div class="scoreWrapper">
                <img src="./images/icon-plus.svg" alt="plus" class="plus">
                <p class="scoreNumber">${comment.score}</p>
                <img src="./images/icon-minus.svg" alt="minus" class="minus">
            </div>
                
            <div class="rightSideWrapper">
            
                <div class="rightSideTopWrapper"> 
                   
                    <div class="personalInfoWrapper">
                        <img src="${comment.user.image.webp}" alt="avatar">
                        <p class="username">${comment.user.username}</p>
                        <p class="time">${Math.floor((Date.now() - comment.createdAt)/1000)}</p>
                    </div>
                    
                    <div class="replyWrapper">
                        <img src="./images/icon-reply.svg" alt="reply">
                        <p class="replyText">Reply</p>
                    </div>
                    
                </div>
                    
                    <p class="comment">${comment.content}</p>
                
            </div>
            
        </div>         
        `

        +

        `<div class="allAnswersWrapper">
        <div class="subCommentsLine"></div>`

        +

        comment.replies.map(reply => `
               
                <div class="memberWrapper subComment" data-id="${reply.id}">
            
                    <div class="scoreWrapper">
                        <img src="./images/icon-plus.svg" alt="plus" class="plus">
                        <p class="scoreNumber">${reply.score}</p>
                        <img src="./images/icon-minus.svg" alt="minus" class="minus">
                    </div>
                        
                    <div class="rightSideWrapper">
                    
                        <div class="rightSideTopWrapper"> 
                           
                            <div class="personalInfoWrapper">
                                <img src="${reply.user.image.webp}" alt="avatar">
                                <p class="username">${reply.user.username}</p>
                                <p class="time">${Math.floor((Date.now() - reply.createdAt)/1000)}</p>
                            </div>
                            
                            <div class="replyWrapper">
                                <img src="./images/icon-reply.svg" alt="reply">
                                <p class="replyText">Reply</p>
                            </div>
                            
                        </div>
                            <p class="comment"><span class="usernameInReply">@${reply.replyingTo} </span>${reply.content}</p>
                        
                    </div>
                    
                </div>
                                
        `).join(``)

        +

        `</div>`
        +
        `</div>`
    );

    const userCommentBox =
        `
        <div class="memberWrapper">
                <img src="${currentUser.image.webp}" alt="avatar">
                <div class="replyInput" aria-placeholder="Add a comment..." contenteditable="true" ></div>
                <div class="userSendButton">SEND</div>
                <span class="popup">You didn't write anything!</span>
        </div>
    `;

    showHtml.push(userCommentBox);
    main.innerHTML = showHtml.join(``);

    const numberOfComments = document.querySelectorAll(`.memberWrapper`);
    let id = numberOfComments.length;


    /* Options only for user */
    function user() {
        const username = document.querySelectorAll(`.username`);
        username.forEach(user => {
            if (currentUser.username === user.textContent) {
                const replyWrapper = user.parentNode.nextElementSibling;
                const personalInfo = replyWrapper.previousElementSibling;
                const userCustomizeWrapper = document.createElement(`div`);
                userCustomizeWrapper.classList.add(`userCustomizeWrapper`);
                userCustomizeWrapper.innerHTML = `
                        <div class="deleteWrapper">
                            <img src="images/icon-delete.svg" alt="deleteIcon">
                            <p class="deleteText">Delete</p>
                        </div>
                        
                        <div class="editWrapper">
                            <img src="images/icon-edit.svg" alt="editIcon">
                            <p class="editText">Edit</p>
                        </div>
                    `
                const you = document.createElement(`div`);
                you.classList.add(`you`);
                you.textContent = `you`;
                user.after(you)
                personalInfo.after(userCustomizeWrapper);
                replyWrapper.remove();

            }
        });
    }

    user();


    /* handle positioning */

    function handleCommentsPositioning() {
        const mainComments = main.querySelectorAll(`.commentWithReplies`);
        const arrayOfMainComments = Array.from(mainComments);

        const sortedMainComments = arrayOfMainComments.sort((a, b) => {
            const aInt = parseInt(a.firstElementChild.firstElementChild.firstElementChild.nextElementSibling.textContent);
            const bInt = parseInt(b.firstElementChild.firstElementChild.firstElementChild.nextElementSibling.textContent);
            return bInt - aInt;
        })

        sortedMainComments.forEach(comment => main.appendChild(comment));
        const p = main.querySelector(`.memberWrapper`);
        main.appendChild(p);

        comments.sort((a,b) => b.score - a.score);
        updateStorageData();
    }
    handleCommentsPositioning();


    /* Handle score */

    function handlePlus(e) {
        let currentScore = e.currentTarget.nextElementSibling;
        const currentComment = e.currentTarget.parentNode.parentNode;

        for (let i = 0; i < comments.length; i++) {
            const dataId = comments[i].id;
            const commentId = parseInt(currentComment.dataset.id);

            if (dataId === commentId) {
                comments[i].score += 1;
                const x = parseInt(currentScore.innerText) + 1;
                currentScore.innerHTML = `${x}`;
                updateStorageData();
            }

            comments[i].replies.forEach(reply => {
                const replyDataId = reply.id;
                if (commentId === replyDataId) {
                    reply.score += 1;
                    const x = parseInt(currentScore.innerText) + 1;
                    currentScore.innerHTML = `${x}`;
                    updateStorageData();
                }
            })

        }
    }

    function handleMinus(e) {
        let currentScore = e.currentTarget.previousElementSibling;
        const currentComment = e.currentTarget.parentNode.parentNode;

        for (let i = 0; i < comments.length; i++) {
            const dataId = comments[i].id;
            const commentId = parseInt(currentComment.dataset.id);

            if (dataId === commentId) {
                comments[i].score -= 1;
                const x = parseInt(currentScore.innerText) - 1;
                currentScore.innerHTML = `${x}`;
                updateStorageData();
            }

            comments[i].replies.forEach(reply => {
                const replyDataId = reply.id;
                if (commentId === replyDataId) {
                    reply.score -= 1;
                    const x = parseInt(currentScore.innerText) - 1;
                    currentScore.innerHTML = `${x}`;
                    updateStorageData();
                }
            })
        }
    }


    /* SET TIME WHEN COMMENT WAS ADDED */

    function timestamp() {
        const timeOfComment = document.querySelectorAll(`.time`);
        timeOfComment.forEach(time => {
            const timeInSec = parseInt(time.textContent);
            const timeInMin = Math.floor(timeInSec/60);
            const timeInHr = Math.floor(timeInMin/60);
            const timeInDays = Math.floor(timeInHr/24);
            const timeInWeeks = Math.floor(timeInDays/7);
            const timeInMonths = Math.floor(timeInDays/30);

            if (timeInSec < 60) {
                time.textContent += `s`;
            }
            if (timeInSec >= 60 && timeInSec < 3600) {
                time.textContent = `${timeInMin} min ago`;
            }
            if (timeInMin >= 60 && timeInMin < 1440) {
                time.textContent = `${timeInHr} hr ago`;
            }
            if (timeInHr >= 24 && timeInHr < 168) {
                if (timeInDays === 1) {
                    time.textContent = `${timeInDays} day ago`;
                } else {
                    time.textContent = `${timeInDays} days ago`;
                }
            }
            if (timeInDays >= 7 && timeInDays < 30) {
                if (timeInWeeks === 1) {
                    time.textContent = `${timeInWeeks} week ago`;
                } else {
                    time.textContent = `${timeInWeeks} weeks ago`;
                }
            }
            if (timeInDays >= 30) {
                if (timeInMonths === 1) {
                    time.textContent = `${timeInMonths} month ago`;
                } else {
                    time.textContent = `${timeInMonths} months ago`;
                }
            }
        })
    }

    timestamp();



    /* SEND NEW COMMENT BUTTON */

    const popup = document.querySelector(`.popup`);

    function handleSendPopup() {
        function hidePopup(e) {
            if (e.target !== userSendButton) {
                popup.classList.remove(`showPopup`);
                document.removeEventListener(`click`, hidePopup);
            }
        }
        document.addEventListener(`click`, hidePopup);
    }

    function handleSendButton(e) {
        const newCommentContent = e.currentTarget.previousElementSibling.textContent;
        const time = Date.now();

        if (newCommentContent === ``) {
            popup.classList.toggle(`showPopup`);
            handleSendPopup();
            return;
        }

        const newCommentData = {
            "id": id,
            "content": `${newCommentContent}`,
            "createdAt": `${time}`,
            "score": 0,
            "user": {
                "image": {
                    "png": `${currentUser.image.png}`,
                    "webp": `${currentUser.image.webp}`
                },
                "username": `${currentUser.username}`
            },
            "replies": []
        }

        comments.push(newCommentData);
        updateStorageData();
        window.location.reload();

    }
    const mainComment = document.querySelectorAll(`.mainComment`);
    const allAnswersWrapper = document.querySelectorAll(`.allAnswersWrapper`);

    /* DELETE FUNCTION */

    function handleDelete(e) {

        /* popup */

        const overlay = document.createElement(`div`);
        overlay.classList.add(`overlay`);

        const deletePopup = document.createElement(`div`);
        deletePopup.classList.add(`deletePopup`);

        deletePopup.innerHTML = `
            <h1>Delete comment</h1>
            <p>Are you sure you want to delete this comment? This will remove the comment and can’t be undone.</p>
            <div class="deletePopupButtonsWrapper">
                <div class="deletePopupNoButton">NO, CANCEL</div>
                <div class="deletePopupYesButton">YES, DELETE</div>
            </div>
        `

        main.after(deletePopup);
        main.after(overlay);

        /* Cancel */

        function handlePopupCancelButton() {
            overlay.remove();
            deletePopup.remove();
        }

        const cancel = document.querySelector(`.deletePopupNoButton`);
        cancel.addEventListener(`click`, handlePopupCancelButton);

        /* Delete */

        const selectedComment = e.currentTarget.parentNode.parentNode.nextElementSibling;

        function handlePopupDeleteButton() {

            for (let i = 0; i < comments.length; i++) {
                const dataTextNoSpace = comments[i].content.replace(/\s/g, ``);
                const selectedCommentTextNoSpace = selectedComment.textContent.replace(/\s/g, ``);

                if (dataTextNoSpace === selectedCommentTextNoSpace) {
                    console.log(`it works`)
                    comments.splice(i, 1);
                    updateStorageData();
                    updateNodes();
                    window.location.reload();
                }

                let p = -1;
                comments[i].replies.forEach(reply => {
                    p++
                    if (reply.content === selectedComment.lastChild.textContent) {
                        comments[i].replies.splice(p, 1);
                        updateStorageData();
                        updateNodes();
                        window.location.reload();
                    }
                })

            }

            handlePopupCancelButton();

        }

        const deleteComment = document.querySelector(`.deletePopupYesButton`);
        deleteComment.addEventListener(`click`, handlePopupDeleteButton);

    }

    /* EDIT/UPDATE FUNCTION */
    function handleEdit(e) {
        const textNode = e.currentTarget.parentNode.parentNode.parentNode.lastElementChild;
        const rightSideWrapperNode = e.currentTarget.parentNode.parentNode.parentNode;
        const existedEditTextArea = e.currentTarget.parentNode.parentNode.nextElementSibling.nextElementSibling;

        if (existedEditTextArea) {
            console.log(existedEditTextArea)
            existedEditTextArea.previousElementSibling.classList.remove(`hidden`);
            existedEditTextArea.nextElementSibling.remove();
            existedEditTextArea.remove();
            return;
        }

        if (textNode.firstChild.tagName) {
            textNode.firstChild.textContent = ``;
        }

        const editTextArea = document.createElement(`div`);
        const updateButton = document.createElement(`div`);


        editTextArea.classList.add(`replyInput`, `editTextarea`);
        editTextArea.setAttribute(`contenteditable`, `true`);

        updateButton.innerText = `UPDATE`;
        updateButton.classList.add(`updateButton`);

        editTextArea.innerText = textNode.innerText;
        textNode.after(editTextArea);
        textNode.classList.add(`hidden`);
        rightSideWrapperNode.appendChild(updateButton);

        updateNodes();


        function handleUpdateButton(e) {
            const parent = e.currentTarget.parentNode.parentNode;


            for (let i=0; i < comments.length; i++ ) {
                const dataId = comments[i].id;
                const commentId = parseInt(parent.dataset.id)

                if (commentId === dataId) {
                    comments[i].content = editTextArea.innerText;
                    textNode.innerText = editTextArea.innerText;
                    textNode.classList.remove(`hidden`);
                    updateStorageData();
                    window.location.reload();
                }

                let p = -1;
                const arrayOfReplies = Array.from(allAnswersWrapper[i].children);
                const subCommentsArray = arrayOfReplies.filter( child => {
                    if (child.classList.contains(`memberWrapper`)) {
                        return true;
                    }
                } )

                subCommentsArray.forEach(child => {
                    p++;
                    if (child === parent) {
                        comments[i].replies[p].content = editTextArea.innerText;
                        textNode.innerText = editTextArea.innerText;
                        textNode.classList.remove(`hidden`);
                        updateStorageData();
                        window.location.reload();
                    }
                })
            }

            editTextArea.remove();
            updateButton.remove();
        }

        updateButton.addEventListener(`click`, handleUpdateButton);

    }


    /* handle reply function */

    function handleReplyButton(e) {
        const currentMember = e.currentTarget.parentNode.parentNode.parentNode;
        const existedComment = currentMember.nextElementSibling;

        /* prevent double reply windows one after one */
        if (existedComment) {
        if (existedComment.classList.contains(`x`)) {
            return;
        }}

        /* add reply window on reply button */

        const userAnswer = document.createElement(`div`);
        const currentRepliedUsername = e.currentTarget.previousElementSibling.firstElementChild.nextElementSibling.textContent;


        userAnswer.innerHTML = `

                <div class="memberWrapper">
                        <img src="${currentUser.image.webp}" alt="avatar">
                        <div class="replyInput" contenteditable="true"><span contenteditable="false">@${currentRepliedUsername}&nbsp;</span></div>
                        <div class="userReplyButtonsWrapper">
                            <div class="userReplyButton">REPLY</div>
                            <div class="userCancelButton">CANCEL</div>
                        </div>
                </div>
            
            `;

        currentMember.after(userAnswer);
        userAnswer.classList.add(`x`);
        updateNodes();


        /* CANCEL/APPLY reply window options */

        function handleUserCancelButton(e) {
            const cancelAdding = e.currentTarget.parentNode.parentNode.parentNode;
            cancelAdding.remove();
        }


        const currentTextarea = currentMember.nextElementSibling.firstElementChild.firstElementChild.nextElementSibling;

        function handleUserReplyButton(e) {
            const time = Date.now();

            const parent = e.currentTarget.parentNode.parentNode.parentNode.previousSibling;
            if (currentTextarea.firstChild && currentTextarea.firstChild.tagName.toLowerCase() === `span`) {
                currentTextarea.firstChild.textContent = ``;
            }

            const replyData = {
                "id": id,
                "content": `${currentTextarea.textContent}`,
                "createdAt": `${time}`,
                "score": 0,
                "replyingTo": `${currentRepliedUsername}`,
                "user": {
                    "image": {
                        "png": `${currentUser.image.png}`,
                        "webp": `${currentUser.image.webp}`
                    },
                    "username": `${currentUser.username}`
                }
            };

            for (let i = 0; i < comments.length; i++) {
                if (mainComment[i] === parent) {
                    comments[i].replies.push(replyData);
                    updateStorageData();
                }


                let p = -1;
                const arrayOfReplies = Array.from(allAnswersWrapper[i].children);
                const subCommentsArray = arrayOfReplies.filter( child => {
                    if (child.classList.contains(`memberWrapper`)) {
                        return true;
                    }
                } )

                console.log(subCommentsArray);

                subCommentsArray.forEach(child => {
                    p++;
                    if (child === parent) {
                        console.log(child)
                        console.log(parent)
                        console.log(p)
                        comments[i].replies.push(replyData);
/*
                        comments[i].replies.splice(p+1,0,replyData);
*/

                        updateStorageData();
                    }
                })

            }

            updateNodes();
            window.location.reload();
        }

        const userCancelButton = document.querySelectorAll(`.userCancelButton`);
        const userReplyButton = document.querySelectorAll(`.userReplyButton`);
        userReplyButton.forEach(button => button.addEventListener(`click`, handleUserReplyButton));
        userCancelButton.forEach(button => button.addEventListener(`click`, handleUserCancelButton));

    }

    updateNodes();

    const userSendButton = document.querySelector(`.userSendButton`);
    userSendButton.addEventListener(`click`, handleSendButton);

    const editButton = document.querySelectorAll(`.editWrapper`);
    editButton.forEach(button => button.addEventListener(`click`, handleEdit));

    const deleteButton = document.querySelectorAll(`.deleteWrapper`);
    deleteButton.forEach( button => button.addEventListener(`click`, handleDelete));

    const scoreMinus = document.querySelectorAll(`.minus`);
    scoreMinus.forEach(minus => minus.addEventListener(`click`, handleMinus));

    const scorePlus = document.querySelectorAll(`.plus`);
    scorePlus.forEach(plus => plus.addEventListener(`click`, handlePlus));

    const chooseUser = document.querySelectorAll(`.dropdownUser`);
    chooseUser.forEach(user => user.addEventListener(`click`, handleChangeUser));

    const login = document.querySelector(`.login`);
    login.addEventListener(`click`, handleDropdownNavigation);
}

const deleteLocalStorage = document.getElementById(`deleteLocalStorage`);

function handleLocalStorage() {
    window.localStorage.clear();
    window.location.reload();
}

deleteLocalStorage.addEventListener(`click`, handleLocalStorage);

commentsData().then();

