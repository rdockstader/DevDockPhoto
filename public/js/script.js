// Setup main slider
$('.main-slide').slick({
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 4000,
  accessibility: false,
  arrows: false,
  pauseOnHover: false,
  pauseOnFocus: false,
});
// Gallary Dropdown
/* When the user clicks on the button, 
toggle between hiding and showing the dropdown content */
function dropDownGallery() {
    document.getElementById("Gallery-drop-down").classList.toggle("show");
}

// Close the dropdown menu if the user clicks outside of it
window.onclick = function(event) {
  if (!event.target.matches('.dropbtn')) {

    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
};

/* MOBILE NAVIGATION */
$(".js--nav-icon").click(function() {
    var nav = $('.js--main-nav');
    var icon = $(".js--nav-icon i");
    
    nav.slideToggle(200);
    if (icon.hasClass('ion-navicon-round')) {
        icon.addClass('ion-close-round');
        icon.removeClass('ion-navicon-round');
    } else {
        icon.removeClass('ion-close-round');
        icon.addClass('ion-navicon-round');
    }
});
