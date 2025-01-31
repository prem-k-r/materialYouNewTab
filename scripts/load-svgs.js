function loadSVG(containerId, svgFile) {
    fetch(svgFile)
        .then(response => response.text())
        .then(svgContent => {
            document.getElementById(containerId).innerHTML = svgContent;
        })
        .catch(() => { });
}

document.addEventListener("DOMContentLoaded", function () {
    // Google Apps
    loadSVG("accountGAIcon", "./svgs/google_apps/account.svg");
    loadSVG("searchGAIcon", "./svgs/google_apps/search.svg");
    loadSVG("youtubeGAIcon", "./svgs/google_apps/youtube.svg");
    loadSVG("gmailGAIcon", "./svgs/google_apps/gmail.svg");
    loadSVG("ytmusicGAIcon", "./svgs/google_apps/yt-music.svg");
    loadSVG("mapsGAIcon", "./svgs/google_apps/maps.svg");
    loadSVG("playGAIcon", "./svgs/google_apps/play.svg");
    loadSVG("driveGAIcon", "./svgs/google_apps/drive.svg");
    loadSVG("photosGAIcon", "./svgs/google_apps/photos.svg");
    loadSVG("translateGAIcon", "./svgs/google_apps/translate.svg");
    loadSVG("calendarGAIcon", "./svgs/google_apps/calendar.svg");
    loadSVG("meetGAIcon", "./svgs/google_apps/meet.svg");
    loadSVG("chatGAIcon", "./svgs/google_apps/chat.svg");
    loadSVG("newsGAIcon", "./svgs/google_apps/news.svg");
    loadSVG("contactsGAIcon", "./svgs/google_apps/contacts.svg");
    loadSVG("myadcenterGAIcon", "./svgs/google_apps/my-ad-center.svg");
    loadSVG("businessGAIcon", "./svgs/google_apps/business-profile.svg");
    loadSVG("shoppingGAIcon", "./svgs/google_apps/shopping.svg");
    loadSVG("docsGAIcon", "./svgs/google_apps/docs.svg");
    loadSVG("sheetsGAIcon", "./svgs/google_apps/sheets.svg");
    loadSVG("presentationGAIcon", "./svgs/google_apps/slides.svg");
    loadSVG("formsGAIcon", "./svgs/google_apps/forms.svg");
    loadSVG("keepGAIcon", "./svgs/google_apps/keep.svg");
    loadSVG("financeGAIcon", "./svgs/google_apps/finance.svg");
    loadSVG("adsGAIcon", "./svgs/google_apps/google-ads.svg");
    loadSVG("analyticsGAIcon", "./svgs/google_apps/google-analytics.svg");
    loadSVG("passwordsGAIcon", "./svgs/google_apps/password-manager.svg");
    loadSVG("oneGAIcon", "./svgs/google_apps/google-one.svg");
    loadSVG("travelGAIcon", "./svgs/google_apps/travel.svg");
    loadSVG("classroomGAIcon", "./svgs/google_apps/classroom.svg");
    loadSVG("booksGAIcon", "./svgs/google_apps/books.svg");
    loadSVG("bloggerGAIcon", "./svgs/google_apps/blogger.svg");
    loadSVG("earthGAIcon", "./svgs/google_apps/google-earth.svg");
    loadSVG("artsandcultureGAIcon", "./svgs/google_apps/arts-and-culture.svg");
    loadSVG("saveGAIcon", "./svgs/google_apps/saved.svg");
    loadSVG("chromestoreGAIcon", "./svgs/google_apps/chrome-web-store.svg");
});
