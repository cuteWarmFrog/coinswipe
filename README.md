<p align="center">
  <img src="https://i.postimg.cc/Dfg4fYSw-/Logo-3.png" />
</p>

<h1 align="center">Memecoin Trading & Social App</h1>
<h3 align="center">Made during ETHWarsaw 2024 hackathon</h3>

Project Overview
----------------

CoinSwipe is a Telegram-based application that gamifies memecoin trading by incorporating a social element. It uses various blockchain technologies to deliver a seamless experience for users interested in trading and connecting over memecoins. Here's how it works:

### Key Features

1.  **Memecoin Swiping**

    -   Users are presented with cards containing information about specific memecoins, including the name, picture, and market statistics.
    -   Users swipe right to buy or left to skip.
    -   Swiping right automatically buys 5 SEI worth of the selected memecoin via DragonSwap.
    -   There is no signing involved as we utilize an embedded wallet, improving UX.
2.  **Portfolio Management**

    -   Users can view their portfolio, which shows the SEI address to which they need to send funds and the memecoins they own.
    -   The portfolio provides a quick overview of holdings and recent transactions.
3.  **Matches Based on Trading Behavior**

    -   Users get matched with others based on their trading patterns.
    -   The current matching criteria are that users must have at least 3 memecoin buys in common.
    -   Future improvements could involve refining this matching algorithm to provide more meaningful matches.
4.  **AI-Powered Messaging**

    -   ORA's LLM (Large Language Model) integration allows users to generate a first message to send to their matches.
    -   The AI-generated message is customized based on the memecoins both users have bought, ensuring relevance and increasing engagement.

### Technologies Used

-   **DB Forest**: Used in the backend to manage data and ensure fast, reliable interactions with the blockchain.
-   **WorldCoin**: Provides user authentication via privacy-preserving proof of personhood protocol, enhancing security and preventing sybil attacks.
-   **DragonSwap**: Handles all memecoin trading operations, allowing seamless swapping of SEI for various memecoins.
-   **ORA**: Powers the AI-driven social features, enabling users to create personalized, context-aware messages for their matches.

### How to Use CoinSwipe

1.  **Login with WorldCoin**: Secure authentication with WorldCoin's privacy-preserving proof of personhood protocol.
2.  **Swipe on Memecoins**: Browse through memecoin cards, see market data, and swipe right to buy or left to skip.
3.  **Build Your Portfolio**: Track your holdings in the portfolio section and manage your SEI and memecoin balances.
4.  **Find Your Matches**: See who you match with based on similar trading patterns.
5.  **Send AI-Generated Messages**: Use ORA-powered AI to craft an engaging first message and break the ice with your matches.

### Future Improvements

-   **Refinement of Matching Algorithm**: Develop more sophisticated matching criteria based on deeper trading behaviors and user profiles.
-   **Support More Chains**: Incorporate memecoins from different chains to offer a broader selection to users.
-   **Enhanced AI Features**: Utilize more AI models to provide different types of engagement, including conversation starters, trading tips, and memecoin insights.
-   **Advanced Portfolio Analytics**: Introduce more in-depth analytics tools to help users better understand their trading patterns and optimize their memecoin strategies.

Team Members
------------

-   **Thierry Blankenstein**
-   **Dmytro Kolida**
-   **Victor Livshits**

Links
-----

-   **Presentation Slides**: [Link to Presentation Slides]
-   **Demo Video**: [Link to Demo Video]
