export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.hook('page:loading:end', () => {
        console.log('page:finish', useRoute().path)
        if(useRoute().path !== '/'){
            const scroller = document.querySelector('.scroller')
            console.log(scroller);
            
            if(scroller)
                scroller.scrollTo({ top: 0, behavior: 'smooth' })
        }
    })
})
