export default defineAppConfig({
    ui: {
        colors: {
            primary: "sky",
            secondary: "amber",
            neutral: "zinc"
        },
        button: {
            compoundVariants: [
                {
                    variant: "solid",
                    class: "hover:bg-secondary active:bg-secondary focus-visible:bg-secondary"
                }
            ]
        }
    }
});