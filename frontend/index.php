<!doctype html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>your notes</title>
    <script src="https://unpkg.com/feather-icons"></script>
    <link rel="stylesheet" href="style.css">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
</head>

<body>
    <div class="container section-1">
        <div class="header d-flex justify-content-between align-items-center sticky-top bg-white">
            <div class="title fs-1 py-4 fw-semibold">
                your notes.
            </div>
            <div class="button-add">
                <button type="button" class="btn d-flex align-items-center" data-bs-toggle="modal" data-bs-target="#ModalCreate">
                    <i data-feather="plus"></i>
                    <span class="ms-1 fw-semibold">Create Note</span>
                </button>
            </div>
        </div>
        <!-- Alert -->
        <div id="alert-container"></div>
        <div class="notes row">

        </div>

        <!-- Modal Create -->
        <div class="modal fade" id="ModalCreate" tabindex="-1" aria-labelledby="ModalCreateLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                <div class="modal-content">
                    <div class="modal-header">
                        <h1 class="modal-title fs-5" id="ModalCreateLabel">Create Note</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="mb-3">
                            <label for="exampleFormControlInput1" class="form-label">Title</label>
                            <input type="text" class="form-control" id="exampleFormControlInput1">
                        </div>
                        <div class="mb-3">
                            <label for="exampleFormControlTextarea1" class="form-label">Content</label>
                            <textarea class="form-control" id="exampleFormControlTextarea1" rows="10"></textarea>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-primary">Create</button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal Show -->
        <div class="modal fade" id="ModalShow" tabindex="-1" aria-labelledby="ModalShowLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                <div class="modal-content">
                    <div class="modal-header">
                        <h1 class="modal-title fs-5" id="ModalShowLabel">11 Februari 2024</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="mb-3">
                            <label for="exampleFormControlInput1" class="form-label">Title</label>
                            <input type="text" class="form-control" id="exampleFormControlInput1" disabled>
                        </div>
                        <div class="mb-3">
                            <label for="exampleFormControlTextarea1" class="form-label">Content</label>
                            <textarea class="form-control" id="exampleFormControlTextarea1" rows="10" disabled></textarea>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-primary" id="button-edit">Edit Note</button>
                        <button type="button" class="btn btn-primary d-none" id="button-update">Save</button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal Delete -->
        <div class="modal modal-sm fade" id="ModalDelete" tabindex="-1" aria-labelledby="ModalDeleteLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header border-0">
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        Delete this note?
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="button" id="button-delete" class="btn btn-primary">Delete</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>
    <script>
        feather.replace();
    </script>
    <script>
        $(document).ready(function() {
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
                setTimeout(function() {
                    $alert.alert("close");
                }, 2000);
            }


            function fetchNotes() {
                $.ajax({
                    url: "http://localhost:8000/notes",
                    method: "GET",
                    dataType: "json",
                    success: function(data) {
                        $(".notes").empty(); // Kosongkan sebelum mengisi ulang
                        if (data.length === 0) {
                            $(".notes").append(`
                                <div class="position-absolute top-50 start-50 translate-middle text-center">
                                    <h1 class="fs-3">empty notes.</h1>
                                </div>
                            `);
                        }
                        data.forEach(note => {
                            let noteItem = `
                                <div class="note-item col-12 col-lg-3 col-md-4 col-sm-6 my-3 p-0">
                                    <button class="show-note border-0 w-100" type="button" data-id="${note.id}" data-bs-toggle="modal" data-bs-target="#ModalShow">
                                        <div class="card text-bg-dark text-start w-100">
                                            <div class="card-header d-flex justify-content-between">
                                                <div>${new Date(note.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}</div>
                                                <a href="#" class="delete-note" data-id="${note.id}" style="text-decoration: none;" data-bs-toggle="modal" data-bs-target="#ModalDelete">
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
                    error: function(err) {
                        console.error("Error fetching notes:", err);
                    }
                });
            }
            fetchNotes();

            $(document).on("click", ".show-note", function() {
                let noteId = $(this).data("id");
                $("#ModalShow input").prop("disabled", true);
                $("#ModalShow textarea").prop("disabled", true);
                $("#button-update").data("id", noteId);

                $.ajax({
                    url: `http://localhost:8000/notes/${noteId}`,
                    method: "GET",
                    dataType: "json",
                    success: function(note) {
                        $("#ModalShowLabel").text(new Date(note.createdAt).toLocaleDateString('en-GB', {
                            day: '2-digit',
                            month: 'long',
                            year: 'numeric'
                        }));
                        $("#ModalShow input").val(note.title);
                        $("#ModalShow textarea").val(note.description);
                    },
                    error: function(err) {
                        console.error("Error fetching note:", err);
                    }
                });
            });

            $(document).on("click", ".delete-note", function() {
                let noteId = $(this).data("id");
                $("#button-delete").data("id", noteId);
            });

            $(document).on("click", "#button-delete", function(e) {
                e.preventDefault();
                let noteId = $(this).data("id");
                $.ajax({
                    url: `http://localhost:8000/notes/${noteId}`,
                    method: "DELETE",
                    success: function() {
                        $("#ModalDelete").modal("hide");
                        showAlert("Note deleted successfully!", "success");
                        fetchNotes(); // Refresh daftar catatan setelah dihapus
                    },
                    error: function(err) {
                        console.error("Error deleting note:", err);
                    }
                });
            });

            $("#ModalCreate .btn-primary").click(function() {
                let title = $("#ModalCreate input").val();
                let description = $("#ModalCreate textarea").val();

                $.ajax({
                    url: "http://localhost:8000/notes",
                    method: "POST",
                    contentType: "application/json",
                    data: JSON.stringify({
                        title,
                        description
                    }),
                    success: function() {
                        $("#ModalCreate").modal("hide");
                        $("#ModalCreate input").val("");
                        $("#ModalCreate textarea").val("");
                        showAlert("Note created successfully!", "success");
                        fetchNotes(); // Refresh daftar catatan
                    },
                    error: function(err) {
                        console.error("Error creating note:", err);
                    }
                });
            });

            $("#button-edit").click(function() {
                $("#ModalShow input, #ModalShow textarea").prop("disabled", false);
                $("#button-edit").addClass("d-none");
                $("#button-update").removeClass("d-none");
            });

            $("#button-update").click(function() {
                let noteId = $(this).data("id");
                let title = $("#ModalShow input").val().trim();
                let description = $("#ModalShow textarea").val().trim();

                if (!title || !description) {
                    showAlert("Title and content cannot be empty!", "warning");
                    return;
                }

                $.ajax({
                    url: `http://localhost:8000/notes/${noteId}`,
                    method: "PUT",
                    contentType: "application/json",
                    data: JSON.stringify({
                        title,
                        description
                    }),
                    success: function() {
                        $("#ModalShow").modal("hide");
                        $("#ModalShow").on("hidden.bs.modal", function() {
                            $("#ModalShow input, #ModalShow textarea").prop("disabled", true);
                            $("#button-edit").removeClass("d-none");
                            $("#button-update").addClass("d-none");
                            fetchNotes();
                        });
                        showAlert("Note updated successfully!", "success");
                    },
                    error: function(err) {
                        console.error("Error updating note:", err);
                        showAlert("Failed to update note!", "danger");
                    }
                });
            });


        });
    </script>
</body>

</html>