document.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => {
        
        let skeltons = document.getElementsByClassName("card-skelton");
        for (i = 0; i < skeltons.length; i++) {
            skeltons[i].style.display = "none";
        }

        let card = document.getElementsByClassName("card");
        for(i = 0; i < card.length; i++) {
            card[i].style.display = "block";
        }


    }, 2000);
});




