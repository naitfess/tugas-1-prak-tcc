// const base_url = "https://backend-alung-86744849728.us-central1.run.app";
const base_url = "localhost:5000";

$(document).ready(function () {
  function showAlert(message, type) {
    let alertHtml = `
          <div class="alert alert-${type} alert-dismissible fade show" role="alert">
              <strong>${message}</strong>
              <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
          </div>
      `;

    let $alert = $(alertHtml);
    $("#alert-container").append($alert);

    // Hapus alert secara otomatis setelah 3 detik
    setTimeout(function () {
      $alert.alert("close");
    }, 2000);
  }

  function fetchNotes() {
    $.ajax({
      url: `${base_url}/notes`,
      method: "GET",
      dataType: "json",
      success: function (data) {
        $(".notes").empty(); // Kosongkan sebelum mengisi ulang
        if (data.length === 0) {
          $(".notes").append(`
                      <div class="position-absolute top-50 start-50 translate-middle text-center">
                          <h1 class="fs-3">empty notes.</h1>
                      </div>
                  `);
        }
        data.forEach((note) => {
          let noteItem = `
                      <div class="note-item col-12 col-lg-3 col-md-4 col-sm-6 my-3 p-0">
                          <button class="show-note border-0 w-100" type="button" data-id="${
                            note.id
                          }" data-bs-toggle="modal" data-bs-target="#ModalShow">
                              <div class="card text-bg-dark text-start w-100">
                                  <div class="card-header d-flex justify-content-between">
                                      <div>${new Date(
                                        note.createdAt
                                      ).toLocaleDateString("en-GB", {
                                        day: "2-digit",
                                        month: "long",
                                        year: "numeric",
                                      })}</div>
                                      <a href="#" class="delete-note" data-id="${
                                        note.id
                                      }" style="text-decoration: none;" data-bs-toggle="modal" data-bs-target="#ModalDelete">
                                          <i data-feather="x"></i>
                                      </a>
                                  </div>
                                  <div class="card-body">
                                      <h5 class="card-title">${note.title}</h5>
                                  </div>
                              </div>
                          </button>
                      </div>
                  `;
          $(".notes").append(noteItem);
        });
        feather.replace();
      },
      error: function (err) {
        console.error("Error fetching notes:", err);
      },
    });
  }
  fetchNotes();

  $(document).on("click", ".show-note", function () {
    let noteId = $(this).data("id");
    $("#ModalShow input").prop("disabled", true);
    $("#ModalShow textarea").prop("disabled", true);
    $("#button-update").data("id", noteId);

    $.ajax({
      url: `${base_url}/notes/${noteId}`,
      method: "GET",
      dataType: "json",
      success: function (note) {
        $("#ModalShowLabel").text(
          new Date(note.createdAt).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          })
        );
        $("#ModalShow input").val(note.title);
        $("#ModalShow textarea").val(note.description);
      },
      error: function (err) {
        console.error("Error fetching note:", err);
      },
    });
  });

  $(document).on("click", ".delete-note", function () {
    let noteId = $(this).data("id");
    $("#button-delete").data("id", noteId);
  });

  $(document).on("click", "#button-delete", function (e) {
    e.preventDefault();
    let noteId = $(this).data("id");
    $.ajax({
      url: `${base_url}/notes/${noteId}`,
      method: "DELETE",
      success: function () {
        $("#ModalDelete").modal("hide");
        showAlert("Note deleted successfully!", "success");
        fetchNotes(); // Refresh daftar catatan setelah dihapus
      },
      error: function (err) {
        console.error("Error deleting note:", err);
      },
    });
  });

  $("#ModalCreate .btn-primary").click(function () {
    let title = $("#ModalCreate input").val();
    let description = $("#ModalCreate textarea").val();

    $.ajax({
      url: `${base_url}/notes`,
      method: "POST",
      contentType: "application/json",
      data: JSON.stringify({
        title,
        description,
      }),
      success: function () {
        $("#ModalCreate").modal("hide");
        $("#ModalCreate input").val("");
        $("#ModalCreate textarea").val("");
        showAlert("Note created successfully!", "success");
        fetchNotes(); // Refresh daftar catatan
      },
      error: function (err) {
        console.error("Error creating note:", err);
      },
    });
  });

  $("#button-edit").click(function () {
    $("#ModalShow input, #ModalShow textarea").prop("disabled", false);
    $("#button-edit").addClass("d-none");
    $("#button-update").removeClass("d-none");
  });

  $("#button-update").click(function () {
    let noteId = $(this).data("id");
    let title = $("#ModalShow input").val().trim();
    let description = $("#ModalShow textarea").val().trim();

    if (!title || !description) {
      showAlert("Title and content cannot be empty!", "warning");
      return;
    }

    $.ajax({
      url: `${base_url}/notes/${noteId}`,
      method: "PUT",
      contentType: "application/json",
      data: JSON.stringify({
        title,
        description,
      }),
      success: function () {
        $("#ModalShow").modal("hide");
        $("#ModalShow").on("hidden.bs.modal", function () {
          $("#ModalShow input, #ModalShow textarea").prop("disabled", true);
          $("#button-edit").removeClass("d-none");
          $("#button-update").addClass("d-none");
          fetchNotes();
        });
        showAlert("Note updated successfully!", "success");
      },
      error: function (err) {
        console.error("Error updating note:", err);
        showAlert("Failed to update note!", "danger");
      },
    });
  });
});
