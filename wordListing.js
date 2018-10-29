$(() => {
    //User Input:
    const wordsInput = $('#search-field');
    //Output:
    const wordsList = $('ul#foundWords');
    const wordCountContainer = $('#wordsCount');
    //options:
    const reversed = $('#reversed');
    const longWords = $('#onlyLongWords');
    const anyCheckBox = $('.form-check-input');
    //page navigation
    const previousPage = $('.page-item.previous');
    const nextPage = $('.page-item.next');

    let words = [];
    let currentPageIndex = 0;
    let numberOfPages = 0;
    loadData();

    //attach events
    wordsInput.keyup(newSearch);
    nextPage.click(goToNextPage);
    previousPage.click(goToPrevPage);
    anyCheckBox.change(goToFirstPage);

    async function loadData() {
        let data = await $.get('words.json');
        words = data['words'];
    }

    function newSearch() {
        goToFirstPage(); //start from first page for every new search
        showResult();
    }

    function showResult() {
        let foundWords = [];
        let wordsOnPage = [];

        filterAndSort();
        paginationDisplayHandle();
        showWords();
        showWordsCount();

        function filterAndSort() {
            let searchFor = wordsInput.val();

            if(searchFor === "") {
                foundWords = [];
            }
            else {
                foundWords = words.filter(w => w.startsWith(searchFor.toLowerCase()));

                if (longWords.is(":checked")) {
                    foundWords = foundWords.filter(w => w.length > 6);
                }
                if (reversed.is(":checked")) {
                    foundWords = foundWords.reverse();
                }
            }

            let start = currentPageIndex * 20;
            wordsOnPage = foundWords.slice(start, start + 20);
        }

        function showWords() {
            wordsList.empty();

            //display words in page
            for (let i = 0; i < wordsOnPage.length; i++) {
                let newItem = $('<li>');
                newItem.html(wordsOnPage[i]);
                wordsList.append(newItem);
            }
        }

        function showWordsCount() {
            wordCountContainer.empty(); //element holding the result

            let wordsCountDisplay = $('<span>').addClass('text-muted');
            wordsCountDisplay.text('(' + foundWords.length + ')');

            let results = $('<h4>');
            results.text('Резултати ');
            results.append(wordsCountDisplay);

            wordCountContainer.append(results);
        }

        function paginationDisplayHandle() {
            previousPage.show();
            nextPage.show();

            numberOfPages =  Math.ceil(foundWords.length / 20);

            if(currentPageIndex === 0) {
                previousPage.hide();
            }
            if(currentPageIndex >= numberOfPages - 1) {
                nextPage.hide();
            }
        }
    }

    function goToNextPage() {
        currentPageIndex++;
        showResult();
    }

    function goToPrevPage() {
        currentPageIndex--;
        showResult();
    }

    function goToFirstPage() {
        currentPageIndex = 0;
        showResult();
    }
});