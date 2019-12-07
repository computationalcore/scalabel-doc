================
User Management
================

The user management has two parts, first is User Authentication and second is user and projects managements.

Overview
-----------

    Our user management is set up in the file `user_management_config.yml`. You have to set `usermanagement` to `"on"` to enable the user management. Once you have enabled the user management, you are going to set up several variables related to AWS Cognito userpool properly. We highly recommend you to set up your AWS Cognito Userpool before you enable the user management.

    Please open the file `app/config/user_management_config.yml`.

    You will see:

    .. image:: ../media/docs/user/empty_yml.png

    You are going to set up the following variables: `userPoolID`, `region`, `clientId`, `redirectUri`, `logOutUri`, `clientSecret`, `awsTokenURL` and `awsJwkUrl`. These variables are retrieved from the AWS cognito userpool.

    Following is the guidance to help you find the corresponding information in the AWS cognito and fill them in the `user_management_config.yml`.

Go to your AWS cognito account
--------------------------------

First please log on to your AWS cognito console. We assume you have already set up your AWS cognito userpool.

1. `userPoolID`

    .. image:: ../media/docs/user/userpoolid.png

    Click the button `General settings` in the first row on the sidebar. And then on the right you will find the `Pool Id`. Copy the value and paste it into your `user_management_config.yml` to the corresponding variable as a string.


2. `region`

    .. image:: ../media/docs/user/region.png


    Then please select the `General settings` on the sidebar, and look at the `Pool Id` again. The first several words of `Pool Id` is the `region`. The format of `region` is `"us-location-number"`, for example, `"us-east-1"` in the picture.

3. `domainName`

    .. image:: ../media/docs/user/domainName.png

    Find the value of the domainName or set it by yourself if you haven't set it yet. And then on the right you will find the `Pool Id`. Copy the value and paste it into your `user_management_config.yml` to the corresponding variable as a string. 


4. `client id`

    .. image:: ../media/docs/user/client_id.png

    Select `App clients` on the sidebar. Then copy the value of `App client id` to `clientId` in your `user_management_config.yml`.


5. `client secret`

    .. image:: ../media/docs/user/client_1.png

    Select `App clients` on the sidebar. Then select `Show Detials` in the blue box.

    .. image:: ../media/docs/user/client_2.png

    Now you can see more details of App clients. Copy the value of `app client secret` to `clientSecret` in your `user_management_config.yml`.

6. `redirectUri` and `logOutUri`

    .. image:: ../media/docs/user/callback_logout_url.png

    Select `App clients settings` on the sidebar. Then you will see `Callback URL(s)` and `Sign out URL(s)` on the righr. Copy the value of `Callback URL(s)` to `redirectUri`, and the value of `Sign out URL(s)` to `logOutUri` in your `user_management_config.yml`.


7. `awsTokenURL`

    .. image:: ../media/docs/user/aws_token_url.png

    Select `Domain name` on the sidebar. Copy the whole url under `Domain prefix` and add "/oauth2/token" as the postfix, so your `awsTokenUrl` will be in this form: `https://...amazoncognito.com/oauth2/token`. Fill `awsTokenURL` with this value in your `user_management_config.yml`.

8. `awsJwkUrl`

    This value must be set to `"https://cognito-idp.%v.amazonaws.com/%v/.well-known/jwks.json"`. Since we are using AWS Cognito, this is the url that allows us to download all the public keys from AWS.

9. `usermanagement`

    At last, please make sure your user management is set to be 'on'.


Launch the server
--------------------

    when you launch the server, in stead of `data/config.yml`, please use `app/config/user_management_config.yml`.

    ::

        mkdir data
        cp app/config/default_config.yml app/config/user_management_config.yml`

