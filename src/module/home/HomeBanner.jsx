import styled from "styled-components";
import Button from "../../components/button/Button";
const HomeBannerStyles = styled.div`
    min-height: 520px;
    padding: 40px 0;
    background-image: linear-gradient(
        to right bottom,
        ${(props) => props.theme.primary},
        ${(props) => props.theme.secondary}
    );
    .banner {
        display: flex;
        justify-content: space-between;
        align-items: center;
        &-content {
            max-width: 600px;
            color: white;
        }
        &-heading {
            font-size: 36px;
            margin-bottom: 20px;
        }
        &-desc {
            line-height: 1.75;
            margin-bottom: 40px;
        }
    }
`;
const HomeBanner = () => {
    return (
        <HomeBannerStyles>
            <div className="container">
                <div className="banner">
                    <div className="banner-content">
                        <h1 className="banner-heading">Monkey Blogging</h1>
                        <p className="banner-desc">
                            Chào mừng bạn đến với Monkey Blogging - nơi bạn có
                            thể tự do chia sẻ những câu chuyện, kinh nghiệm và ý
                            tưởng của mình. Chúng tôi cung cấp một nền tảng đơn
                            giản, dễ sử dụng để bạn có thể bắt đầu blog ngay lập
                            tức. Với giao diện thân thiện, quy trình đăng ký
                            nhanh chóng và hỗ trợ kỹ thuật 24/7, bạn sẽ sớm trở
                            thành một blogger thành công!
                        </p>
                        <Button to="/sign-up">Get started</Button>
                    </div>
                    <div className="banner-image">
                        <img src="/img-banner.png" alt="Banner" />
                    </div>
                </div>
            </div>
        </HomeBannerStyles>
    );
};

export default HomeBanner;
