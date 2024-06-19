import { useState } from "react";
import {
  Form,
  FormControl,
  Container,
  Row,
  Col,
  ToggleButton,
  ToggleButtonGroup,
  Spinner
} from "react-bootstrap";
import axios from "axios";

interface Book {
  title: string;
  author_name: string[];
  first_publish_year: number;
  isbn: string[];
  number_of_pages_median: number;
}

function OpenLibraryBookSearch() {
  const [books, setBooks] = useState<Book[]>([]);
  const [unsortedBooks, setUnSortedBooks] = useState<Book[]>([]);
  const [sortOrder, setSortOrder] = useState("relevance");
  const [loading, setLoading] = useState(false);

  const getData = (data: any) => {
    console.log("Fetching Data ..", data);
    setLoading(true);
    axios
      .get(`https://openlibrary.org/search.json?q=${data}`)
      .then((response) => {
        const data = response.data.docs.map((book: any) => ({
          title: book.title,
          author_name: book.author_name,
          first_publish_year: book.first_publish_year,
          isbn: book.isbn,
          number_of_pages_median: book.number_of_pages_median,
        }));
        setUnSortedBooks(data);
        setBooks(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  const handleSortChange = (val: string) => {
    setSortOrder(val);
    if (val === "year") {
      setBooks(
        [...books].sort((a, b) => a.first_publish_year - b.first_publish_year)
      );
    } else {
      setBooks([...unsortedBooks]);
    }
  };

  const debounce = function (fn: any, d: any) {
    let timer: any;
    return function (event: any) {
      clearTimeout(timer);
      timer = setTimeout(() => {
        fn(event.target.value);
      }, d);
    };
  };

  const betterFunction: any = debounce(getData, 1000);

  return (
    <>
      <Container>
        {loading ? (
          <Row>
            <Col className="text-center my-3">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </Col>
          </Row>
        ) : (
          <>
            <Row className="my-4">
              <Col>
                <Form>
                  <FormControl
                    type="text"
                    placeholder="Search for a book"
                    onKeyUp={betterFunction}
                  />
                </Form>
              </Col>
            </Row>
            <Row>
              <Col>
                <ToggleButtonGroup
                  type="radio"
                  name="sortOrder"
                  value={sortOrder}
                  onChange={handleSortChange}
                >
                  <ToggleButton id="tbg-radio-1" value={"relevance"}>
                    Relevance
                  </ToggleButton>
                  <ToggleButton id="tbg-radio-2" value={"year"}>
                    Year
                  </ToggleButton>
                </ToggleButtonGroup>
              </Col>
            </Row>
            <Row>
              {books.map((book, index) => (
                <Col key={index} md={4} className="my-3">
                  <div className="border p-3">
                    <h5>{book.title}</h5>
                    <p>
                      <strong>Author(s):</strong>{" "}
                      {book?.author_name?.length
                        ? book.author_name.join(", ")
                        : "N/A"}
                    </p>
                    <p>
                      <strong>First Published:</strong>{" "}
                      {book.first_publish_year}
                    </p>
                    <p>
                      <strong>ISBN:</strong> {book.isbn ? book.isbn[0] : "N/A"}
                    </p>
                    <p>
                      <strong>Number of Pages:</strong>{" "}
                      {book.number_of_pages_median}
                    </p>
                  </div>
                </Col>
              ))}
            </Row>
          </>
        )}
      </Container>
    </>
  );
}

export default OpenLibraryBookSearch;
