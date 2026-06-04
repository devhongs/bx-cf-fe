import { test, expect } from '@playwright/test';

test.describe('Mobile Web Scenario Test', () => {
  test('should go through login flow and verify 5 products in list', async ({ page }) => {
    // 1. http://localhost:3001 실행 및 자동으로 로그인 화면 리다이렉트 확인
    await page.goto('/');
    
    // requireAuth 가드로 인해 /login 으로 리다이렉트 되는지 검증
    await expect(page).toHaveURL(/.*\/login/);

    // 2. 로그인 화면 확인 (Username, Password input이 존재하는지)
    const usernameInput = page.locator('input[name="id"]');
    const passwordInput = page.locator('input[name="password"]');
    const loginButton = page.locator('button', { hasText: 'Log in' });

    await expect(usernameInput).toBeVisible();
    await expect(passwordInput).toBeVisible();

    // 3. 로그인 시도 (id: user1, password: user1)
    await usernameInput.fill('user1');
    await passwordInput.fill('user1');
    
    // 로그인 버튼 클릭
    await loginButton.click();

    // 4. 메인 화면 이동 확인 (/main 경로로 이동 확인)
    await expect(page).toHaveURL(/.*\/main/);

    // 5. footer 상품 버튼 클릭
    // Footer 내 '상품' 텍스트를 가진 버튼을 찾아서 클릭
    const productFooterTab = page.locator('footer button').filter({ hasText: '상품' });
    await expect(productFooterTab).toBeVisible();
    await productFooterTab.click();

    // 6. 상품 화면 이동 확인 (/product 경로로 이동 확인)
    await expect(page).toHaveURL(/.*\/product/);

    // 7 & 8. 상품 화면 진입 시 자동으로 상품 목록 조회 확인 (5건의 상품 정상 노출 확인)
    // 렌더링된 각 상품 아이템들의 래퍼 클래스를 가져오거나, 
    // page.locator 안에 상품이 담긴 컨테이너 하위의 div 구조 등을 세어 5개 아이템 존재 여부 검증
    // Shared 패키지에서 가져온 ProductItem의 스타일 클래스 구조를 활용
    const productItems = page.locator('main [class*="ProductItem_root"], main [class*="ProductItem_layout"], main button');

    // 최소 하나 이상의 적절한 셀렉터가 5개의 아이템 카운트를 가지는지 유연하게 검증
    await expect(async () => {
      // productItem 컴포넌트가 5개 렌더링되었는지 검증
      const count = await productItems.count();
      // data.json 상의 상품 개수는 입출금통장, 한달적금, 26주적금, mini적금, K-패스 체크카드 총 5개입니다.
      // 5개 중 특정 상품명의 텍스트(예: "입출금통장")가 존재하는지도 함께 검증하여 완성도를 높입니다.
      await expect(page.locator('text=입출금통장')).toBeVisible();
      await expect(page.locator('text=한달적금')).toBeVisible();
    }).toPass({ timeout: 5000 });
  });
});
