
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

interface IRouter {
    function swapExactTokensForTokens(
        uint amountIn,
        uint amountOutMin,
        address[] calldata path,
        address to,
        uint deadline
    ) external returns (uint[] memory amounts);

    function getAmountsOut(uint amountIn, address[] calldata path)
        external
        view
        returns (uint[] memory amounts);
}

interface IERC20 {
    function transfer(address recipient, uint256 amount) external returns (bool);
    function approve(address spender, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}

contract CrossChainUSDC {
    address public owner;
    address public router;
    address public usdc;

    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }

    constructor(address _router, address _usdc) {
        owner = msg.sender;
        router = _router;
        usdc = _usdc;
    }

    function swapTokens(
        uint amountIn,
        uint amountOutMin,
        address[] calldata path,
        uint deadline
    ) external onlyOwner {
        IERC20(usdc).approve(router, amountIn);
        IRouter(router).swapExactTokensForTokens(
            amountIn,
            amountOutMin,
            path,
            address(this),
            deadline
        );
    }

    function checkParity(
        uint amountIn,
        address[] calldata path
    ) external view returns (uint[] memory amounts) {
        return IRouter(router).getAmountsOut(amountIn, path);
    }

    function withdrawTokens(address to, uint256 amount) external onlyOwner {
        IERC20(usdc).transfer(to, amount);
    }
}
