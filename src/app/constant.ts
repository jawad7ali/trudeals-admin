
export const ckEditorConfig = {
    height: 200,
    language: "en",
    allowedContent: true,
    toolbarGroups: [
        {
            name: "basicstyles",
            groups: ["Bold", "Italic", "Strike", "-", "RemoveFormat"],
        },
        { name: "paragraph", groups: ["list", "indent", "blocks", "align"] },
        { name: "links", groups: ["Link", "Unlink", "Anchor"] },
        { name: "styles", groups: ["Styles", "Format", "Font", "FontSize"] },
        { name: "colors", groups: ["TextColor", "BGColor"] },
    ],
    removeButtons:
        "Source,Save,Templates,Find,Replace,Scayt,SelectAll,forms,document",
};
