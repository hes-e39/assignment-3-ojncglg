// Import styled-components for defining custom CSS styles directly in JavaScript
import styled from "styled-components";

// Import a component for documenting other components
import DocumentComponent from "../components/documentation/DocumentComponent";

// Import a generic loading spinner component
import Loading from "../components/generic/Loading";

// ------------------- Styled Components -------------------

// Container: Styles the layout for the documentation page
const Container = styled.div`
  display: flex; /* Enables flexbox layout */
  justify-content: center; /* Centers the content horizontally */
  width: 100%; /* Makes the container span the full width */
`;

// Title: Styles the title of the documentation page
const Title = styled.div`
  font-size: 2rem; /* Sets a large font size for the title */
`;

// ------------------- Documentation Component -------------------

/**
 * Documentation: A page that documents the functionality and usage of components
 */
const Documentation = () => {
  return (
    <Container>
      {/* Main content of the documentation page */}
      <div>
        {/* Title of the page */}
        <Title>Documentation</Title>

        {/* Component documentation using the DocumentComponent */}
        <DocumentComponent
          title="Loading spinner " // Title for the documented component
          component={<Loading size="medium" color="#ffa2bf" />} // Example usage of the Loading component
          propDocs={[
            {
              prop: "size", // Name of the prop
              description: "Changes the size of the loading spinner", // Description of the prop
              type: "string", // Type of the prop
              defaultValue: "medium", // Default value of the prop
            },
          ]}
        />
      </div>
    </Container>
  );
};

// Export the Documentation component as the default export
export default Documentation;
