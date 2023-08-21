import styled from "styled-components";
import Heading from "../../components/layout/Heading";
import PostFeatureItem from "../post/PostFeatureItem";
const HomeFeatureStyles = styled.div``;

const HomeFeature = () => {
    return (
        <HomeFeatureStyles className="home-block">
            <div className="container">
                <Heading>Feature</Heading>
                <div className="grid-layout">
                    <PostFeatureItem></PostFeatureItem>
                    <PostFeatureItem></PostFeatureItem>
                    <PostFeatureItem></PostFeatureItem>
                </div>
            </div>
        </HomeFeatureStyles>
    );
};

export default HomeFeature;
