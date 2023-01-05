import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { LayoutComponent } from "./layout.component";

const routes: Routes = [
    {
        path: "",
        component: LayoutComponent,
        children: [
            {
                path: "",
                redirectTo: "dashboard",
            },
            {
                path: "dashboard",
                loadChildren: "./dashboard/dashboard.module#DashboardModule",
            },
            // {
            //     path: 'herelo',
            //     loadChildren: './herelo/herelo.module#hereloModule'
            // },
            // {
            //     path: 'vote',
            //     loadChildren: './vote/vote.module#voteModule'
            // },
            // {
            //     path: 'changePassword',
            //     loadChildren: './Changepassword/Changepassword.module#ChangePasswordModule'
            // },
            // {
            //     path: 'FAQ',
            //     loadChildren: './FAQ/FAQ.module#FAQModule'
            // },
            // {
            //     path: 'contactUs',
            //     loadChildren: './contactUs/contactUs.module#ContactUsModule'
            // },
            // {
            //     path: 'add-question',
            //     loadChildren: './add-question/add-question.module#AddQuestionModule'
            // },
            {
                path: "media",
                loadChildren: "./media/media.module#MediaModule",
            },
            {
                path: "add-media",
                loadChildren: "./add-media/add-media.module#AddMediaModule",
            },
            {
                path: "category",
                loadChildren: "./category/category.module#CategoryModule",
            },
            {
                path: "manage-category/:id",
                loadChildren:
                    "./add-category/add-category.module#AddCategoryModule",
            },
            {
                path: "location",
                loadChildren: "./location/location.module#LocationModule",
            },
            {
                path: "manage-location/:id",
                loadChildren:
                    "./add-location/add-location.module#AddLocationModule",
            },
            {
                path: "users",
                loadChildren: "./users/users.module#UsersModule",
            },
            {
                path: "manage-user/:id",
                loadChildren: "./add-users/add-users.module#AddUsersModule",
            },
            {
                path: "admin/:id",
                loadChildren: "./add-admins/add-admins.module#AddAdminsModule",
            },
            {
                path: "deals",
                loadChildren: "./deals/deals.module#DealsModule",
            },
            {
                path: "manage-deal/:id/:businessId",
                loadChildren: "./add-deals/add-deals.module#AddDealsModule",
            },
            {
                path: "news",
                loadChildren: "./news/news.module#NewsModule",
            },
			{
                path: "pages",
                loadChildren: "./pages/pages.module#PagesModule",
            },
            {
                path: "manage-news/:id",
                loadChildren: "./add-news/add-news.module#AddNewsModule",
            },
			{
                path: "manage-pages/:id",
                loadChildren: "./add-pages/add-pages.module#AddPagesModule",
            },
            {
                path: "banners",
                loadChildren: "./banners/banners.module#BannersModule",
            },
            {
                path: "manage-banner/:id",
                loadChildren: "./add-banner/add-banner.module#AddBannerModule",
            },
            {
                path: "FAQs",
                loadChildren: "./faq/faq.module#FAQModule",
            },
            {
                path: "QnA",
                loadChildren: "./qa/qa.module#QaModule",
            },
            {
                path: "comments",
                loadChildren: "./comments/comments.module#CommentsModule",
            },
            {
                path: "member-ship",
                loadChildren:
                    "./member-ship/member-ship.module#MemberShipModule",
            },
            {
                path: "manege-member-ship/:id",
                loadChildren:
                    "./member-ship-edit/member-ship-edit.module#MemberShipEditModule",
            },
            {
                path: "business",
                loadChildren: "./business/business.module#BusinessModule",
            },
            {
                path: "manage-business/:id",
                loadChildren:
                    "./add-business/add-business.module#AddBusinessModule",
            },
            {
                path: "manage-promocode/:id",
                loadChildren:
                    "./add-promo-code/add-promo-code.module#AddPromoCodeModule",
            },
            {
                path: "promocode",
                loadChildren: "./promo-code/promo-code.module#PromoCodeModule",
            },
            {
                path: "video",
                loadChildren: "./video/video.module#VideoModule",
            },
            {
                path: "page-blocks",
                loadChildren:
                    "./page-blocks/page-blocks.module#PageBlocksModule",
            },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class LayoutRoutingModule {}
