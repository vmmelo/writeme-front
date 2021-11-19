import Swal from 'sweetalert2';

export const alertError = (title, text, footer) => {
  Swal.fire({
    icon: 'error',
    title: title || 'Oops...',
    text: text || 'Something went wrong!',
    footer: footer || false,
  });
};
