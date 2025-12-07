import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

export const TopNav = () => {
  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container >
        <Navbar.Brand href="/">Naga Chandana Mudusu</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link href="/about">About</Nav.Link>
            <Nav.Link href="/skills">Skills</Nav.Link>
            <Nav.Link href="/experience">Experience</Nav.Link>
            <Nav.Link href="/projects">Projects</Nav.Link>
          </Nav>
      </Container>
    </Navbar>
  );
}

