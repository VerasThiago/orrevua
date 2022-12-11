import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { ReactComponent as AddBtn } from '../../../images/add_circle.svg';
import { formatCpf } from '../../../utils/index';

export default function TableUsers({ data }) {
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 8;
  const pageNumbers = [];
  const numberOfPages = Math.ceil(data.length / usersPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [data]);

  for (let i = 1; i <= numberOfPages; i++) {
    pageNumbers.push(i);
  }

  const paginateNext = () => {
    setCurrentPage((currentPage) => currentPage + 1);
  };

  const paginatePrevious = () => {
    setCurrentPage((currentPage) => currentPage - 1);
  };

  return (
    <div>
      <table className="table border-dark">
        <tbody>
          <tr className="fw-bold">
            <th>Nome</th>
            <th>E-mail</th>
            <th>CPF</th>
            <th></th>
          </tr>
          {data
            .slice(currentPage * usersPerPage - usersPerPage, usersPerPage * currentPage)
            .map((item, index) => (
              <tr key={index}>
                <td>
                  <NavLink
                    className="text-decoration-none text-white"
                    to={`/admin/users/${item.id}`}>
                    {item.name}
                  </NavLink>
                </td>

                <td>{item.email}</td>
                <td>{formatCpf(item.cpf)}</td>
                <td>
                  <NavLink to={`/admin/users/${item.id}/ticket/create`}>
                    <AddBtn />
                  </NavLink>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      <nav>
        <ul className="pagination justify-content-center">
          <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
            <a className="page-link" onClick={paginatePrevious}>
              <span role="button" aria-hidden="true">
                &laquo;
              </span>
            </a>
          </li>
          {pageNumbers.map((num, index) => (
            <li className={`page-item ${currentPage === num ? 'active' : ''}`} key={index}>
              <span role="button" className="page-link" onClick={() => setCurrentPage(num)}>
                {num}
              </span>
            </li>
          ))}
          <li className={`page-item ${currentPage === numberOfPages ? 'disabled' : ''}`}>
            <a className="page-link" onClick={paginateNext}>
              <span role="button" aria-hidden="true">
                &raquo;
              </span>
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
}
