// Import styled-components to define custom styles in JavaScript
import styled from "styled-components";

// ------------------- Styled Components -------------------

// Wrapper: Styles the outermost container for the documentation component
const Wrapper = styled.div`
  border: 1px solid #121212; /* Dark border for the wrapper */
  margin: 20px 0px; /* Vertical margin to add spacing around the component */
`;

// Container: Styles the main layout for the component's content
const Container = styled.div`
  padding: 20px; /* Adds inner padding around the content */
  display: flex; /* Enables flexbox layout for content alignment */
  justify-content: space-between; /* Distributes items with space between them */
`;

// Title: Styles the title section of the component
const Title = styled.div`
  display: flex; /* Enables flexbox layout */
  justify-content: center; /* Centers the title horizontally */
  padding-top: 20px; /* Adds space above the title */
  font-size: 1.3rem; /* Medium font size */
`;

// RenderComponent: Styles the area where the actual component is rendered
const RenderComponent = styled.div`
  padding: 25px; /* Adds inner padding around the component */
  display: flex; /* Enables flexbox layout */
  align-items: center; /* Centers the content vertically */
`;

// Documentation: Styles the table used for documenting the component's props
const Documentation = styled.table``; /* Empty style (defaults to browser's table styling) */

// ------------------- DocumentComponent -------------------

/**
 * DocumentComponent: A reusable component for documenting other components
 *
 * Props:
 * - title: The title of the documented component
 * - component: The React component being documented
 * - propDocs: Array of documentation objects describing the component's props
 */
const DocumentComponent = ({
  title, // Title of the component being documented
  component, // The React component to render and document
  propDocs, // Array of prop documentation objects
}: {
  title: string; // Title must be a string
  component: React.ReactNode; // The documented component (can be any React node)
  propDocs: {
    prop: string; // Name of the prop
    description: string; // Description of the prop's purpose
    type: string; // Type of the prop (e.g., string, number)
    defaultValue: string; // Default value of the prop
  }[];
}) => {
  return (
    <Wrapper>
      {/* Render the title of the documented component */}
      <Title>{title}</Title>

      {/* Layout for the rendered component and its documentation */}
      <Container>
        {/* Render the actual component */}
        <RenderComponent>{component}</RenderComponent>

        {/* Render a table documenting the component's props */}
        <Documentation>
          <thead>
            <tr>
              <th>Prop</th> {/* Column header for prop names */}
              <th>Description</th> {/* Column header for prop descriptions */}
              <th>Type</th> {/* Column header for prop types */}
              <th>Default value</th> {/* Column header for default values */}
            </tr>
          </thead>
          <tbody>
            {propDocs.map((doc) => {
              return (
                <tr key={doc.description}>
                  {/* Render each property's details */}
                  <td>{doc.prop}</td> {/* Prop name */}
                  <td>{doc.description}</td> {/* Prop description */}
                  <td>{doc.type}</td> {/* Prop type */}
                  <td>
                    <code>{doc.defaultValue}</code> {/* Default value in code style */}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Documentation>
      </Container>
    </Wrapper>
  );
};

// Export the DocumentComponent as the default export
export default DocumentComponent;
